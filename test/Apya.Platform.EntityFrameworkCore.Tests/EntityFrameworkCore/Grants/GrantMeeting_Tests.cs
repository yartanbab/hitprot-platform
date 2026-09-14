using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 18e · Görüşme slotu: firma bekleyen talebi için üç saat önerir, host'a bildirim gider; danışman birini onaylar
/// (talep incelemeye alınır, firmaya saatle bildirim gider) ya da notla başka saat ister ve firma yeniden önerir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantMeeting_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantInterestAppService _tenantService;
    private readonly IGrantInterestHostAppService _hostService;
    private readonly IGrantJourneyAppService _journeyService;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantMeeting_Tests()
    {
        _tenantService = GetRequiredService<IGrantInterestAppService>();
        _hostService = GetRequiredService<IGrantInterestHostAppService>();
        _journeyService = GetRequiredService<IGrantJourneyAppService>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static List<DateTime> Slots()
    {
        var day = DateTime.Now.Date.AddDays(3);
        return new List<DateTime> { day.AddHours(15).AddMinutes(30), day.AddHours(10), day.AddDays(2).AddHours(9).AddMinutes(30) };
    }

    /// <summary>Host çağrısı + kullanıcılı kiracı + o kiracıda bekleyen ilgi talebi.</summary>
    private async Task<(Guid TenantId, Guid InterestId)> CreatePendingInterestAsync(string name)
    {
        var grant = await GetRequiredService<IRepository<Grant, Guid>>()
            .InsertAsync(new Grant(Guid.NewGuid(), name, "TÜBİTAK", 1_000_000m, minMatchScore: 0), autoSave: true);
        var call = await GetRequiredService<IRepository<GrantCall, Guid>>()
            .InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik), autoSave: true);

        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name + " Firma " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        using (_currentTenant.Change(tenant.Id))
        {
            var suffix = Guid.NewGuid().ToString("N")[..6];
            (await GetRequiredService<IdentityUserManager>()
                .CreateAsync(new IdentityUser(Guid.NewGuid(), "firma-" + suffix, $"firma-{suffix}@apya.test", tenant.Id))).Succeeded.ShouldBeTrue();
            var interest = await _interestRepository.InsertAsync(new GrantInterest(Guid.NewGuid(), tenant.Id, call.Id, null, "fikir"), autoSave: true);
            return (tenant.Id, interest.Id);
        }
    }

    private Task<List<Notification>> NotificationsAsync(NotificationType type) => _notificationRepository.GetListAsync(n => n.Type == type);

    [Fact]
    public async Task Firma_uc_saat_onerir_danisman_onaylar_talep_incelemeye_alinir()
    {
        var (tenantId, interestId) = await CreatePendingInterestAsync("Görüşme Programı");
        var hostBefore = (await NotificationsAsync(NotificationType.GrantMeetingProposed)).Count;
        var slots = Slots();

        GrantMeetingDto proposed;
        using (_currentTenant.Change(tenantId))
        {
            proposed = await _tenantService.ProposeMeetingAsync(new ProposeGrantMeetingInput { InterestId = interestId, Slots = slots });
            var again = await Should.ThrowAsync<BusinessException>(() =>
                _tenantService.ProposeMeetingAsync(new ProposeGrantMeetingInput { InterestId = interestId, Slots = Slots() }));
            again.Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingAlreadyOpen);
        }

        proposed.Status.ShouldBe(GrantMeetingStatus.Bekliyor);
        proposed.Slots.ShouldBe(slots.OrderBy(s => s).ToList());
        var hostNotifications = await NotificationsAsync(NotificationType.GrantMeetingProposed);
        hostNotifications.Count.ShouldBeGreaterThan(hostBefore);
        hostNotifications.ShouldAllBe(n => !n.Body.Contains("{önerilen_saatler}"));

        var review = await _hostService.GetReviewAsync(interestId);
        review.Meeting.ShouldNotBeNull().Id.ShouldBe(proposed.Id);

        review = await _hostService.ConfirmMeetingAsync(new ConfirmGrantMeetingInput { ProposalId = proposed.Id, SlotIndex = 1 });

        review.Meeting!.Status.ShouldBe(GrantMeetingStatus.Onaylandi);
        review.Meeting.ConfirmedSlot.ShouldBe(proposed.Slots[1]);
        review.Interest.Status.ShouldBe(GrantInterestStatus.Inceleniyor);

        using (_currentTenant.Change(tenantId))
        {
            var answered = (await NotificationsAsync(NotificationType.GrantMeetingAnswered)).ShouldHaveSingleItem();
            answered.Body.ShouldContain("onaylandı", Case.Sensitive);
            answered.Body.ShouldNotContain("{görüşme_sonucu}");

            var item = (await _journeyService.GetAsync()).Items.Single(i => i.InterestId == interestId);
            item.Meeting.ShouldNotBeNull().Status.ShouldBe(GrantMeetingStatus.Onaylandi);
        }
    }

    [Fact]
    public async Task Baska_saat_istenince_firma_yeniden_onerir_kapanmis_talebe_oneri_acilmaz()
    {
        var (tenantId, interestId) = await CreatePendingInterestAsync("Yeniden Öneri");
        GrantMeetingDto first;
        using (_currentTenant.Change(tenantId))
        {
            first = await _tenantService.ProposeMeetingAsync(new ProposeGrantMeetingInput { InterestId = interestId, Slots = Slots() });
        }

        var review = await _hostService.RequestOtherMeetingTimeAsync(new RequestGrantMeetingTimeInput
        {
            ProposalId = first.Id,
            Note = "Bu hafta takvimim dolu, gelecek hafta sabah saatleri uygun."
        });
        review.Meeting!.Status.ShouldBe(GrantMeetingStatus.BaskaSaatIstendi);
        review.Interest.Status.ShouldBe(GrantInterestStatus.Yeni);
        (await Should.ThrowAsync<BusinessException>(() =>
                _hostService.ConfirmMeetingAsync(new ConfirmGrantMeetingInput { ProposalId = first.Id, SlotIndex = 0 })))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingNotPending);

        using (_currentTenant.Change(tenantId))
        {
            (await NotificationsAsync(NotificationType.GrantMeetingAnswered)).ShouldHaveSingleItem()
                .Body.ShouldContain("gelecek hafta sabah saatleri uygun", Case.Sensitive);
            (await _journeyService.GetAsync()).Items.Single(i => i.InterestId == interestId).Meeting!.Status
                .ShouldBe(GrantMeetingStatus.BaskaSaatIstendi);

            var second = await _tenantService.ProposeMeetingAsync(new ProposeGrantMeetingInput { InterestId = interestId, Slots = Slots() });
            second.Status.ShouldBe(GrantMeetingStatus.Bekliyor);
            (await _journeyService.GetAsync()).Items.Single(i => i.InterestId == interestId).Meeting!.Id.ShouldBe(second.Id);

            await _tenantService.WithdrawAsync(interestId);
        }

        var openProposalId = (await _hostService.GetReviewAsync(interestId)).Meeting!.Id;
        (await Should.ThrowAsync<BusinessException>(() =>
                _hostService.ConfirmMeetingAsync(new ConfirmGrantMeetingInput { ProposalId = openProposalId, SlotIndex = 0 })))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingInterestClosed);

        using (_currentTenant.Change(tenantId))
        {
            (await Should.ThrowAsync<BusinessException>(() =>
                    _tenantService.ProposeMeetingAsync(new ProposeGrantMeetingInput { InterestId = interestId, Slots = Slots() })))
                .Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingInterestClosed);
        }
    }
}
