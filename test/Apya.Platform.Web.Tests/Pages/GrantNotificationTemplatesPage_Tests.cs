using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 6d · Bildirim şablonları konsolu ve tetikleyicilerin GERÇEKTEN ateşlendiği.
///
/// <para>Şablon ekranını doğrulamak tek başına yetmez: asıl risk, host'un metni
/// düzenlediği ama hiçbir olayın bildirim üretmediği "ölü konsol" durumudur.</para>
/// </summary>
public class GrantNotificationTemplatesPage_Tests : PlatformWebTestBase
{
    private readonly IGrantNotificationTemplateAppService _templates;
    private readonly IGrantApplicationDocumentAppService _documents;
    private readonly IGrantAppealAppService _appeal;
    private readonly ICurrentTenant _currentTenant;

    public GrantNotificationTemplatesPage_Tests()
    {
        _templates = GetRequiredService<IGrantNotificationTemplateAppService>();
        _documents = GetRequiredService<IGrantApplicationDocumentAppService>();
        _appeal = GetRequiredService<IGrantAppealAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    // ------------------------------------------------------------------ konsol

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/NotificationTemplates");

        html.ShouldContain("apya-nt-layout");
        html.ShouldContain("Değişkenler");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"NotificationTemplates[^""]*\.js")
            .ShouldBeTrue("sayfa demeti NotificationTemplates.js içermeli");
    }

    [Fact]
    public async Task Yedi_Tetikleyici_De_Tohumlanir()
    {
        var dto = await _templates.GetAsync();

        dto.Templates.Count.ShouldBe(Enum.GetValues<GrantNotificationTrigger>().Length);
        dto.Templates.Select(t => t.Trigger).ShouldBeUnique();
        // Sıra enum sırasıdır: süreçte hangi olayın önce geldiğini anlatır.
        dto.Templates.Select(t => (int)t.Trigger)
            .ShouldBe(dto.Templates.Select(t => (int)t.Trigger).OrderBy(x => x));
        dto.EnabledCount.ShouldBe(dto.Templates.Count);
    }

    [Fact]
    public async Task Onizleme_Ornek_Degerlerle_Dolar()
    {
        var dto = await _templates.GetAsync();
        var stage = dto.Templates.Single(t => t.Trigger == GrantNotificationTrigger.ApplicationStageChanged);

        stage.Subject.ShouldContain("{aşama}");
        stage.PreviewSubject.ShouldNotContain("{");
        stage.PreviewBody.ShouldNotContain("{");
        stage.Variables.ShouldContain("{aşama}");
    }

    /// <summary>
    /// Hiçbir şablonun önizlemesinde ham süslü parantez KALMAMALI.
    ///
    /// <para>🔴 Bu testi yazma sebebi: <c>{karar}</c> değeri 6b ekranının başlık
    /// metninden (<c>"Başvurunuz reddedildi · {0}"</c>) okunuyordu; o metin kendi
    /// parametresini taşıdığı için bildirim gövdesine ham <c>{0}</c> sızıyordu.
    /// Tek tek anahtar okumak bunu yakalamaz — tarama gerekir.</para>
    /// </summary>
    [Fact]
    public async Task Hicbir_Onizlemede_Ham_Token_Kalmaz()
    {
        var dto = await _templates.GetAsync();

        foreach (var t in dto.Templates)
        {
            var text = t.PreviewSubject + " | " + t.PreviewBody;
            System.Text.RegularExpressions.Regex.IsMatch(text, @"\{[^}]*\}")
                .ShouldBeFalse($"{t.Trigger} önizlemesinde ham token var: {text}");
            text.ShouldNotContain("Grants:", Case.Sensitive,
                $"{t.Trigger} önizlemesinde çözülmemiş yerelleştirme anahtarı var");
        }
    }

    [Fact]
    public async Task Metin_Kaydedilir_Ve_Onizleme_Yenilenir()
    {
        var before = (await _templates.GetAsync()).Templates
            .Single(t => t.Trigger == GrantNotificationTrigger.CallPublished);

        var after = (await _templates.SaveAsync(new SaveGrantNotificationTemplateInput
        {
            Id = before.Id,
            Subject = "Yeni çağrı: {çağrı_adı}",
            Body = "{firma_adı} için açıldı. Son gün {son_tarih}.",
            IsEnabled = true,
            InApp = true,
            Email = true
        })).Templates.Single(t => t.Id == before.Id);

        after.Subject.ShouldBe("Yeni çağrı: {çağrı_adı}");
        after.Email.ShouldBeTrue();
        after.PreviewSubject.ShouldNotContain("{çağrı_adı}");
        after.PreviewBody.ShouldNotContain("{firma_adı}");
    }

    [Fact]
    public async Task Zorunlu_Sablon_Kapatilamaz()
    {
        var decision = (await _templates.GetAsync()).Templates
            .Single(t => t.Trigger == GrantNotificationTrigger.DecisionIssued);

        decision.IsMandatory.ShouldBeTrue();

        await Should.ThrowAsync<BusinessException>(async () =>
            await _templates.SaveAsync(new SaveGrantNotificationTemplateInput
            {
                Id = decision.Id,
                Subject = decision.Subject,
                Body = decision.Body,
                IsEnabled = false,
                InApp = true,
                Email = true
            }));
    }

    [Fact]
    public async Task Kiraci_Baglamindan_Erisilemez()
    {
        var tenantId = await CreateTenantAsync();

        using (_currentTenant.Change(tenantId))
        {
            await Should.ThrowAsync<Volo.Abp.Authorization.AbpAuthorizationException>(
                async () => await _templates.GetAsync());
        }
    }

    // ------------------------------------------------------- tetikleyiciler ateşliyor mu

    /// <summary>
    /// Danışman revizyon istediğinde firma tarafında GERÇEKTEN bildirim oluşmalı ve
    /// türü doğru olmalı — daha önce hibe bildirimleri tek "öneri" tipiyle gidiyordu.
    /// </summary>
    [Fact]
    public async Task Revizyon_Istegi_Firmaya_Bildirim_Uretir()
    {
        var (tenantId, applicationId, documentId) = await SetupTenantApplicationAsync();

        await _documents.RegisterVersionAsync(new RegisterGrantDocumentVersionInput
        {
            DocumentId = documentId,
            StoredFileName = Guid.NewGuid() + ".pdf",
            OriginalFileName = "form.pdf",
            SizeBytes = 512
        });

        await _documents.RequestRevisionAsync(new RequestGrantDocumentRevisionInput
        {
            DocumentId = documentId,
            Note = "Tarih güncel değil."
        });

        var notifications = await ReadNotificationsAsync(tenantId, NotificationType.GrantDocumentRevisionRequested);

        notifications.ShouldNotBeEmpty("revizyon isteği firmaya bildirim üretmeli");
        notifications[0].Body.ShouldContain("Tarih güncel değil.");
        notifications[0].EntityId.ShouldBe(applicationId);
    }

    /// <summary>
    /// Kurum kararı ZORUNLU bildirimdir: kullanıcı hibe bildirimlerini kapatmış
    /// olsa bile üretilir, çünkü kaçırılması itiraz hakkının kaybı demektir.
    /// </summary>
    [Fact]
    public async Task Kurum_Karari_Tercih_Kapaliyken_De_Bildirim_Uretir()
    {
        var (tenantId, applicationId, _) = await SetupTenantApplicationAsync();
        await MuteGrantNotificationsAsync(tenantId);

        await _appeal.SaveDecisionAsync(new SaveGrantDecisionInput
        {
            ApplicationId = applicationId,
            Outcome = GrantDecisionOutcome.Reddedildi,
            DecidedOn = DateTime.Now,
            AppealDeadline = DateTime.Now.AddDays(15)
        });

        var decisions = await ReadNotificationsAsync(tenantId, NotificationType.GrantDecisionIssued);
        decisions.ShouldNotBeEmpty("zorunlu bildirim kullanıcı tercihini aşmalı");
        decisions[0].Body.ShouldContain("İtiraz için son gün");
    }

    /// <summary>Zorunlu OLMAYAN tetikleyici, tercih kapalıyken susmalı.</summary>
    [Fact]
    public async Task Zorunlu_Olmayan_Bildirim_Tercih_Kapaliyken_Uretilmez()
    {
        var (tenantId, _, documentId) = await SetupTenantApplicationAsync();
        await MuteGrantNotificationsAsync(tenantId);

        await _documents.RegisterVersionAsync(new RegisterGrantDocumentVersionInput
        {
            DocumentId = documentId,
            StoredFileName = Guid.NewGuid() + ".pdf",
            OriginalFileName = "form.pdf",
            SizeBytes = 512
        });
        await _documents.RequestRevisionAsync(new RequestGrantDocumentRevisionInput
        {
            DocumentId = documentId,
            Note = "yeniden yükleyin"
        });

        (await ReadNotificationsAsync(tenantId, NotificationType.GrantDocumentRevisionRequested))
            .ShouldBeEmpty("tercih kapalıyken zorunlu olmayan bildirim üretilmemeli");
    }

    /// <summary>Şablon kapatıldığında tetikleyici hiç bildirim üretmemeli.</summary>
    [Fact]
    public async Task Kapali_Sablon_Bildirim_Uretmez()
    {
        var (tenantId, _, documentId) = await SetupTenantApplicationAsync();

        var template = (await _templates.GetAsync()).Templates
            .Single(t => t.Trigger == GrantNotificationTrigger.DocumentRevisionRequested);
        await _templates.SaveAsync(new SaveGrantNotificationTemplateInput
        {
            Id = template.Id,
            Subject = template.Subject,
            Body = template.Body,
            IsEnabled = false,
            InApp = true,
            Email = false
        });

        await _documents.RegisterVersionAsync(new RegisterGrantDocumentVersionInput
        {
            DocumentId = documentId,
            StoredFileName = Guid.NewGuid() + ".pdf",
            OriginalFileName = "form.pdf",
            SizeBytes = 512
        });
        await _documents.RequestRevisionAsync(new RequestGrantDocumentRevisionInput
        {
            DocumentId = documentId,
            Note = "not"
        });

        (await ReadNotificationsAsync(tenantId, NotificationType.GrantDocumentRevisionRequested))
            .ShouldBeEmpty("kapalı şablon bildirim üretmemeli");
    }

    // ------------------------------------------------------------------ kurulum

    /// <summary>
    /// Kiracıyı VE içinde bir kullanıcıyı kurar.
    ///
    /// <para>Kullanıcısız kiracı bu testler için işe yaramaz: bildirim alıcı listesi
    /// boş kalır ve dağıtıcı hiç yazmadan döner — "bildirim üretilmedi" hatası
    /// tetikleyicinin değil, kurulumun eksikliğini gösterirdi.</para>
    /// </summary>
    private async Task<Guid> CreateTenantAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();
        var userRepo = GetRequiredService<IRepository<Volo.Abp.Identity.IdentityUser, Guid>>();

        using var uow = uowManager.Begin(requiresNew: true);

        var tenant = await tenantManager.CreateAsync("Bildirim-" + Guid.NewGuid().ToString("N")[..6]);
        await tenantRepo.InsertAsync(tenant, autoSave: true);

        using (_currentTenant.Change(tenant.Id))
        {
            var userId = Guid.NewGuid();
            await userRepo.InsertAsync(new Volo.Abp.Identity.IdentityUser(
                userId, $"firma-{userId:N}", $"{userId:N}@test.local", tenant.Id), autoSave: true);
        }

        await uow.CompleteAsync();
        return tenant.Id;
    }

    private async Task<(Guid TenantId, Guid ApplicationId, Guid DocumentId)> SetupTenantApplicationAsync()
    {
        var tenantId = await CreateTenantAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        Guid applicationId;

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var reqRepo = GetRequiredService<IRepository<GrantDocumentRequirement, Guid>>();
            var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();

            var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();

            if ((await reqRepo.GetListAsync(r => r.GrantId == call.GrantId)).Count == 0)
            {
                await reqRepo.InsertAsync(
                    new GrantDocumentRequirement(Guid.NewGuid(), call.GrantId, 0, "Proje öneri formu")
                    {
                        Obligation = GrantDocumentObligation.Zorunlu,
                        UploaderParty = GrantPartyRole.Firma
                    }, autoSave: true);
            }

            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            await appRepo.InsertAsync(application, autoSave: true);
            applicationId = application.Id;

            await uow.CompleteAsync();
        }

        // Kontrol listesi ilk okumada şablondan türetilir.
        var console = await _documents.GetAsync(applicationId);
        return (tenantId, applicationId, console.Documents.First().Id);
    }

    /// <summary>Kiracının tüm kullanıcıları için Hibe kategorisini sessize alır.</summary>
    private async Task MuteGrantNotificationsAsync(Guid tenantId)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var prefRepo = GetRequiredService<IRepository<NotificationPreference, Guid>>();
        var userRepo = GetRequiredService<Volo.Abp.Identity.IIdentityUserRepository>();

        using var uow = uowManager.Begin(requiresNew: true);
        using (_currentTenant.Change(tenantId))
        {
            foreach (var user in await userRepo.GetListAsync())
            {
                await prefRepo.InsertAsync(new NotificationPreference(
                    Guid.NewGuid(), tenantId, user.Id, NotificationCategory.Grants,
                    inApp: false, email: false), autoSave: true);
            }
        }
        await uow.CompleteAsync();
    }

    private async Task<System.Collections.Generic.List<Notification>> ReadNotificationsAsync(
        Guid tenantId, NotificationType type)
    {
        var repo = GetRequiredService<IRepository<Notification, Guid>>();
        using (_currentTenant.Change(tenantId))
        {
            return await repo.GetListAsync(n => n.Type == type);
        }
    }
}
