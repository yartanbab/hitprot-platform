using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 19b · Fikir daveti: alıcı kümesi, gönderim ve bildirim, "yanıtladı" hesabı, tek hatırlatma ve firmanın kendi
/// davetini okuması. Koleksiyondaki diğer testler de firma bıraktığı için her test kendi firmalarına bakar.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantIdeaInvitation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantIdeaInvitationAppService _invitations;
    private readonly IGrantInterestAppService _interests;
    private readonly GrantIdeaInvitationManager _manager;
    private readonly IRepository<GrantIdeaInvitationRecipient, Guid> _recipientRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IRepository<FirmProfile, Guid> _profileRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public GrantIdeaInvitation_Tests()
    {
        _invitations = GetRequiredService<IGrantIdeaInvitationAppService>();
        _interests = GetRequiredService<IGrantInterestAppService>();
        _manager = GetRequiredService<GrantIdeaInvitationManager>();
        _recipientRepository = GetRequiredService<IRepository<GrantIdeaInvitationRecipient, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _profileRepository = GetRequiredService<IRepository<FirmProfile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    /// <summary>Kullanıcılı firma (bildirim etkin kullanıcıya düşer); ölçek verilirse profil de açılır.</summary>
    private async Task<Guid> CreateFirmAsync(string prefix, CompanySize? size = null)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(prefix + " " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        using (_currentTenant.Change(tenant.Id))
        {
            var suffix = Guid.NewGuid().ToString("N")[..6];
            (await GetRequiredService<IdentityUserManager>()
                .CreateAsync(new IdentityUser(Guid.NewGuid(), "davet-" + suffix, $"davet-{suffix}@apya.test", tenant.Id))).Succeeded.ShouldBeTrue();
            if (size != null)
            {
                await _profileRepository.InsertAsync(new FirmProfile(Guid.NewGuid(), tenant.Id) { Size = size }, autoSave: true);
            }
        }
        return tenant.Id;
    }

    private async Task ShareIdeaAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            await _interests.ShareIdeaAsync(new ShareGrantIdeaInput { Note = "Fikir", ProblemStatement = "Sorun" });
        }
    }

    private async Task<int> InvitedNotificationCountAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantIdeaInvited)).Count;
        }
    }

    [Fact]
    public async Task Suzulmus_grup_olcege_ve_havuzdaki_fikre_gore_secer()
    {
        var small = await CreateFirmAsync("Küçük Firma", CompanySize.Kucuk);
        var big = await CreateFirmAsync("Büyük Firma", CompanySize.Buyuk);
        var unknown = await CreateFirmAsync("Profilsiz Firma");
        var smallWithIdea = await CreateFirmAsync("Fikirli Küçük", CompanySize.Kucuk);
        await ShareIdeaAsync(smallWithIdea);

        var filtered = (await _manager.ResolveAudienceAsync(
            GrantIdeaInvitationAudience.Filtered, null, (int)(CompanySize.Kucuk | CompanySize.Orta), onlyWithoutPoolIdea: true))
            .Select(t => t.Id).ToList();

        filtered.ShouldContain(small);
        // Ölçeğini girmemiş firma elenmez (Eşleştirme ekranının kuralı).
        filtered.ShouldContain(unknown);
        filtered.ShouldNotContain(big);
        filtered.ShouldNotContain(smallWithIdea);

        (await _invitations.CountRecipientsAsync(new GrantIdeaInvitationAudienceInput { Audience = GrantIdeaInvitationAudience.Single, TenantId = big }))
            .ShouldBe(1);
        (await _invitations.CountRecipientsAsync(new GrantIdeaInvitationAudienceInput { Audience = GrantIdeaInvitationAudience.All }))
            .ShouldBeGreaterThanOrEqualTo(4);
    }

    [Fact]
    public async Task Havuz_daveti_bildirim_gonderir_fikir_paylasan_yanitladi_sayilir()
    {
        var firm = await CreateFirmAsync("Davetli Firma");
        var before = await InvitedNotificationCountAsync(firm);

        var sent = await _invitations.SendAsync(new SendGrantIdeaInvitationInput
        {
            Audience = GrantIdeaInvitationAudience.Single,
            TenantId = firm,
            Message = "Proje fikirlerinizi şimdiden paylaşın.",
            RemindAfterDays = 10
        });

        sent.RecipientCount.ShouldBe(1);
        (await InvitedNotificationCountAsync(firm)).ShouldBe(before + 1);
        using (_currentTenant.Change(firm))
        {
            var notification = (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantIdeaInvited))
                .OrderByDescending(n => n.CreationTime).First();
            notification.EntityId.ShouldBe(sent.InvitationId);
            notification.Body.ShouldContain("Proje fikirlerinizi şimdiden paylaşın.");
            notification.Title.ShouldNotStartWith("Hatırlatma");
        }

        var latest = (await _invitations.GetLatestAsync()).ShouldNotBeNull();
        latest.Id.ShouldBe(sent.InvitationId);
        latest.RecipientCount.ShouldBe(1);
        latest.RespondedCount.ShouldBe(0);
        latest.RemindAt.ShouldNotBeNull();

        await ShareIdeaAsync(firm);

        (await _invitations.GetLatestAsync())!.RespondedCount.ShouldBe(1);
    }

    [Fact]
    public async Task Yanitlamayana_bir_kez_hatirlatilir()
    {
        var responder = await CreateFirmAsync("Yanıtlayan");
        var silent = await CreateFirmAsync("Sessiz");
        var sent = await _invitations.SendAsync(new SendGrantIdeaInvitationInput
        {
            Audience = GrantIdeaInvitationAudience.Single, TenantId = responder, Message = "Davet", RemindAfterDays = 1
        });
        // İkinci firma aynı davete eklenir (toplu seçimin tek firmalık hâli).
        var second = await _invitations.SendAsync(new SendGrantIdeaInvitationInput
        {
            Audience = GrantIdeaInvitationAudience.Single, TenantId = silent, Message = "Davet", RemindAfterDays = 1
        });
        await ShareIdeaAsync(responder);
        var silentBefore = await InvitedNotificationCountAsync(silent);
        var responderBefore = await InvitedNotificationCountAsync(responder);

        // Süre dolmadan hatırlatma yok.
        (await WithUnitOfWorkAsync(() => _manager.SendDueRemindersAsync(_clock.Now))).ShouldBe(0);

        var later = _clock.Now.AddDays(2);
        var reminded = await WithUnitOfWorkAsync(() => _manager.SendDueRemindersAsync(later));

        reminded.ShouldBeGreaterThanOrEqualTo(1);
        (await InvitedNotificationCountAsync(silent)).ShouldBe(silentBefore + 1);
        (await InvitedNotificationCountAsync(responder)).ShouldBe(responderBefore);
        using (_currentTenant.Change(silent))
        {
            (await _notificationRepository.GetListAsync(n => n.Type == NotificationType.GrantIdeaInvited))
                .OrderByDescending(n => n.CreationTime).First().Title.ShouldStartWith("Hatırlatma:");
        }
        (await _recipientRepository.GetListAsync(r => r.InvitationId == second.InvitationId)).Single().RemindedAt.ShouldNotBeNull();
        (await _recipientRepository.GetListAsync(r => r.InvitationId == sent.InvitationId)).Single().RemindedAt.ShouldBeNull();

        // İkinci koşu aynı firmaya yeniden göndermez.
        await WithUnitOfWorkAsync(() => _manager.SendDueRemindersAsync(later.AddDays(1)));
        (await InvitedNotificationCountAsync(silent)).ShouldBe(silentBefore + 1);
    }

    [Fact]
    public async Task Cagri_daveti_yalniz_acik_cagriya_ve_uyan_firma_varsa_gider()
    {
        var grant = await GetRequiredService<IRepository<Grant, Guid>>()
            .InsertAsync(new Grant(Guid.NewGuid(), "Davet Programı", "Kurum", 1_000_000m, 0), autoSave: true);
        var draft = await GetRequiredService<IRepository<GrantCall, Guid>>()
            .InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Taslak), autoSave: true);
        var firm = await CreateFirmAsync("Çağrı Davetlisi");

        (await Should.ThrowAsync<BusinessException>(() => _invitations.SendAsync(new SendGrantIdeaInvitationInput
        {
            Audience = GrantIdeaInvitationAudience.Single, TenantId = firm, GrantCallId = draft.Id, Message = "Davet"
        }))).Code.ShouldBe(PlatformDomainErrorCodes.GrantInvitationCallNotOpen);

        (await Should.ThrowAsync<BusinessException>(() => _invitations.SendAsync(new SendGrantIdeaInvitationInput
        {
            Audience = GrantIdeaInvitationAudience.Single, TenantId = Guid.NewGuid(), Message = "Davet"
        }))).Code.ShouldBe(PlatformDomainErrorCodes.GrantInvitationNoRecipients);
    }

    [Fact]
    public async Task Firma_yalniz_kendisine_gelen_daveti_okur()
    {
        var invited = await CreateFirmAsync("Davet Alan");
        var other = await CreateFirmAsync("Davet Almayan");
        var sent = await _invitations.SendAsync(new SendGrantIdeaInvitationInput
        {
            Audience = GrantIdeaInvitationAudience.Single, TenantId = invited, Message = "Fikrinizi bekliyoruz"
        });

        using (_currentTenant.Change(invited))
        {
            var mine = await _interests.GetInvitationAsync(sent.InvitationId);
            mine.Message.ShouldBe("Fikrinizi bekliyoruz");
            mine.GrantCallId.ShouldBeNull();
        }

        using (_currentTenant.Change(other))
        {
            await Should.ThrowAsync<EntityNotFoundException>(() => _interests.GetInvitationAsync(sent.InvitationId));
        }
    }
}
