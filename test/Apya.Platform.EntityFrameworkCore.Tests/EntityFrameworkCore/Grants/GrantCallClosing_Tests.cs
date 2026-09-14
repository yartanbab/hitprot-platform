using System;
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
/// 18b · Host çağrıyı kapatınca çalışan sabit zincir: yanıtlanmamış talepler kaçırılır, yarım
/// kalan firmalara benzer çağrılarla TEK bildirim gider; tekrar kapatmak ikinci bildirim üretmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantCallClosing_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantCallAppService _callAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantCallClosing_Tests()
    {
        _callAppService = GetRequiredService<IGrantCallAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Grant Grant, GrantCall Call)> CreateHostCallAsync(string name)
    {
        _currentTenant.Id.ShouldBeNull();
        var grant = new Grant(Guid.NewGuid(), name, "Kurum", 1_000_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(call, autoSave: true);
        return (grant, call);
    }

    /// <summary>Bildirim kiracının etkin kullanıcılarına gider; kullanıcısız kiracıya gönderilemez.</summary>
    private async Task<Guid> CreateTenantWithUserAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        using (_currentTenant.Change(tenant.Id))
        {
            var suffix = Guid.NewGuid().ToString("N")[..6];
            var user = new IdentityUser(Guid.NewGuid(), "firma-" + suffix, $"firma-{suffix}@apya.test", tenant.Id);
            (await GetRequiredService<IdentityUserManager>().CreateAsync(user)).Succeeded.ShouldBeTrue();
        }
        return tenant.Id;
    }

    private Task<GrantCallDto> SetStatusAsync(GrantCall call, GrantCallStatus status)
        => _callAppService.UpdateAsync(call.Id, new CreateUpdateGrantCallDto
        {
            GrantId = call.GrantId,
            Period = call.Period,
            Status = status,
            OpenDate = call.OpenDate,
            Deadline = call.Deadline
        });

    private async Task<int> ClosedNotificationCountAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantCallClosed)).Count;
        }
    }

    [Fact]
    public async Task Kapaninca_bekleyen_talep_kacirilir_yarim_kalanlara_tek_bildirim_gider()
    {
        var closedName = "Kapanan Program " + Guid.NewGuid().ToString("N")[..4];
        var (_, call) = await CreateHostCallAsync(closedName);
        await CreateHostCallAsync("Benzer Açık Program");

        var pendingFirm = await CreateTenantWithUserAsync("Bekleyen");
        var draftFirm = await CreateTenantWithUserAsync("Yarım Başvuru");
        var submittedFirm = await CreateTenantWithUserAsync("Gönderen");
        var answeredFirm = await CreateTenantWithUserAsync("Cevaplanan");

        Guid pendingId, answeredId;
        using (_currentTenant.Change(pendingFirm))
        {
            var interest = new GrantInterest(Guid.NewGuid(), pendingFirm, call.Id, null, "fikir");
            await _interestRepository.InsertAsync(interest, autoSave: true);
            pendingId = interest.Id;
        }
        using (_currentTenant.Change(draftFirm))
        {
            await _appRepository.InsertAsync(new GrantApplication(Guid.NewGuid(), draftFirm, call.Id), autoSave: true);
        }
        using (_currentTenant.Change(submittedFirm))
        {
            var submitted = new GrantApplication(Guid.NewGuid(), submittedFirm, call.Id);
            submitted.Submit(DateTime.Now);
            await _appRepository.InsertAsync(submitted, autoSave: true);
        }
        using (_currentTenant.Change(answeredFirm))
        {
            var answered = new GrantInterest(Guid.NewGuid(), answeredFirm, call.Id, null, "fikir");
            answered.Reject("Kapsam dışı.", null, DateTime.Now);
            await _interestRepository.InsertAsync(answered, autoSave: true);
            answeredId = answered.Id;
        }

        var dto = await SetStatusAsync(call, GrantCallStatus.Kapandi);

        dto.ClosingSummary.ShouldNotBeNull();
        dto.ClosingSummary!.MissedInterestCount.ShouldBe(1);
        dto.ClosingSummary.UnfinishedApplicationCount.ShouldBe(1, "gönderilmiş başvuru yarım sayılmaz");
        dto.ClosingSummary.NotifiedFirmCount.ShouldBe(2);

        using (_currentTenant.Change(pendingFirm))
        {
            var missed = await _interestRepository.GetAsync(pendingId);
            missed.Status.ShouldBe(GrantInterestStatus.Kacirildi);
            missed.HostFeedback.ShouldNotBeNullOrWhiteSpace("gerekçe otomatik yazılır ve firmaya gösterilir");
        }
        using (_currentTenant.Change(answeredFirm))
        {
            (await _interestRepository.GetAsync(answeredId)).Status.ShouldBe(GrantInterestStatus.UygunDegil, "karara bağlanmış talebe dokunulmaz");
        }

        (await ClosedNotificationCountAsync(pendingFirm)).ShouldBe(1);
        (await ClosedNotificationCountAsync(draftFirm)).ShouldBe(1);
        (await ClosedNotificationCountAsync(submittedFirm)).ShouldBe(0);
        (await ClosedNotificationCountAsync(answeredFirm)).ShouldBe(0);

        using (_currentTenant.Change(draftFirm))
        {
            // Test veritabanında tohum çağrıları da açık: hangi ikisinin önerileceği uyum puanına bağlı.
            // Sözleşme: başlık kapanan çağrıyı anar, gövde gerçek öneri taşır, kapanan çağrı önerilmez.
            var notification = (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantCallClosed)).Single();
            notification.Title.ShouldContain(closedName, Case.Sensitive);
            notification.Body.ShouldContain("(%");
            notification.Body.ShouldNotContain("{benzer_çağrılar}");
            notification.Body.ShouldNotContain(closedName, Case.Sensitive);
        }
    }

    [Fact]
    public async Task Kapali_cagriyi_yeniden_kaydetmek_ya_da_acip_kapatmak_bildirimi_tekrarlamaz()
    {
        var (_, call) = await CreateHostCallAsync("Tekrar Program " + Guid.NewGuid().ToString("N")[..4]);
        var draftFirm = await CreateTenantWithUserAsync("Tekrar Firma");
        using (_currentTenant.Change(draftFirm))
        {
            await _appRepository.InsertAsync(new GrantApplication(Guid.NewGuid(), draftFirm, call.Id), autoSave: true);
        }

        (await SetStatusAsync(call, GrantCallStatus.Kapandi)).ClosingSummary!.NotifiedFirmCount.ShouldBe(1);

        // Zaten kapalıyken kaydetmek zinciri çalıştırmaz.
        (await SetStatusAsync(call, GrantCallStatus.Kapandi)).ClosingSummary.ShouldBeNull();

        // Yeniden açıp kapatmak zinciri çalıştırır ama aynı firmaya ikinci bildirim gitmez.
        (await SetStatusAsync(call, GrantCallStatus.Acik)).ClosingSummary.ShouldBeNull();
        (await SetStatusAsync(call, GrantCallStatus.Kapandi)).ClosingSummary!.NotifiedFirmCount.ShouldBe(0);

        (await ClosedNotificationCountAsync(draftFirm)).ShouldBe(1);
    }

    [Fact]
    public void Karara_baglanmis_talep_kacirilamaz()
    {
        var interest = new GrantInterest(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), null, "fikir");
        interest.Withdraw(DateTime.Now);

        Should.Throw<BusinessException>(() => interest.MarkMissed("kapandı", DateTime.Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
    }
}
