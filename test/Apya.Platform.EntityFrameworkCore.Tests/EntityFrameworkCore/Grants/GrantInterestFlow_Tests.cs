using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Validation;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// KİLİT SÖZLEŞME: başvuruyu HOST açar. Kiracı çağrıya ilgi bildirir; başvuru ancak
/// host talebi olumlu karara bağlayınca ve TALEBİ BIRAKAN KİRACIDA doğar.
///
/// <para>Regresyon kaynağı: host kutusu kiracılar arası çalışıyor. Başvuru host
/// bağlamında açılsaydı <c>TenantId=null</c> ile doğar ve firma kendi başvurusunu
/// hiç göremezdi; talep okuması kiracı bağlamına geçmeseydi kutu hep boş kalırdı.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantInterestFlow_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantInterestAppService _interestAppService;
    private readonly IGrantInterestHostAppService _hostAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _applicationRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IRepository<GrantBookmark, Guid> _bookmarkRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantInterestFlow_Tests()
    {
        _interestAppService = GetRequiredService<IGrantInterestAppService>();
        _hostAppService = GetRequiredService<IGrantInterestHostAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _applicationRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _bookmarkRepository = GetRequiredService<IRepository<GrantBookmark, Guid>>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Host kataloğunda açık bir çağrı.</summary>
    private async Task<GrantCall> CreateHostCallAsync(string name, bool requiresConsortium = false)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");

        var grant = new Grant(Guid.NewGuid(), name, "Kurum", maxAmount: 100_000m, minMatchScore: 0)
        {
            RequiresConsortium = requiresConsortium
        };
        await _grantRepository.InsertAsync(grant, autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    /// <summary>Host kutusu kiracıları <c>ITenantRepository</c>'den gezdiği için gerçek kiracı gerekir.</summary>
    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    [Fact]
    public async Task Host_sureci_baslatinca_basvuru_talebi_birakan_kiracida_dogar()
    {
        var call = await CreateHostCallAsync("Süreç Başlatma Programı");
        var tenantId = await CreateTenantAsync("İlgi Talebi A.Ş. " + Guid.NewGuid().ToString("N")[..6]);

        Guid interestId;
        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "12 aylık Ar-Ge projesi", ProblemStatement = "Sorun" });
            interestId = interest.Id;

            // Talep tek başına başvuru DEĞİLDİR: bu aşamada ortada başvuru yoktur.
            (await _applicationRepository.GetListAsync()).ShouldNotContain(a => a.GrantCallId == call.Id);
        }

        var console = await _hostAppService.StartApplicationAsync(interestId);

        // Karara bağlanan talep bekleyenler listesinden düşer, sayaçta "başvuruya dönen" olur.
        console.Items.ShouldNotContain(i => i.Id == interestId);
        console.StartedCount.ShouldBeGreaterThanOrEqualTo(1);

        using (_currentTenant.Change(tenantId))
        {
            var application = (await _applicationRepository.GetListAsync())
                .SingleOrDefault(a => a.GrantCallId == call.Id);

            application.ShouldNotBeNull("başvuru talebi bırakan kiracıda açılmalı");
            application!.TenantId.ShouldBe(tenantId);

            var mine = await _interestAppService.GetMineAsync();
            var row = mine.Single(i => i.Id == interestId);
            row.Status.ShouldBe(GrantInterestStatus.BasvuruAcildi);
            row.GrantApplicationId.ShouldBe(application.Id);
        }
    }

    [Fact]
    public async Task Talep_birakilinca_host_bildirim_alir()
    {
        var call = await CreateHostCallAsync("Bildirim Programı");
        var tenantId = await CreateTenantAsync("Haber Veren " + Guid.NewGuid().ToString("N")[..6]);

        using (_currentTenant.Change(tenantId))
        {
            await _interestAppService.ExpressAsync(new ExpressGrantInterestInput
            {
                GrantCallId = call.Id,
                Note = "Ortak arayışımız var.",
                ProblemStatement = "Sorun"
            });
        }

        // Bildirim HOST'a gider: kiracıya değil, kutuyu açacak danışman ekibine.
        var notifications = await _notificationRepository.GetListAsync(
            n => n.Type == NotificationType.GrantInterestReceived);

        notifications.ShouldNotBeEmpty("kiracı ilgi bildirdiğinde host haberdar olmalı");
        notifications.ShouldContain(n => n.TenantId == null, "alıcı host kullanıcısıdır");

        var latest = notifications.OrderByDescending(n => n.CreationTime).First();
        latest.Body.ShouldContain("Bildirim Programı");
        latest.Body.ShouldContain("Ortak arayışımız var.");
    }

    /// <summary>
    /// Host'a giden bildirimde firma, kiracı adıyla (unvandan türetilmiş kısa anahtar) değil
    /// Kurum Profili'ndeki resmî unvanıyla anılır.
    /// </summary>
    [Fact]
    public async Task Host_bildirimi_kurumu_resmi_unvaniyla_anar()
    {
        var call = await CreateHostCallAsync("Unvan Programı");
        var tenantId = await CreateTenantAsync("unvan-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<IRepository<Apya.Platform.Tenants.TenantProfile, Guid>>().InsertAsync(
            new Apya.Platform.Tenants.TenantProfile(Guid.NewGuid(), tenantId, Apya.Platform.Tenants.CompanyType.Association, string.Empty, string.Empty)
            {
                LegalName = "Unvanlı Gençlik ve Spor Derneği"
            },
            autoSave: true);

        using (_currentTenant.Change(tenantId))
        {
            await _interestAppService.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Unvan testi.", ProblemStatement = "Sorun" });
        }

        var notification = (await _notificationRepository.GetListAsync(
                n => n.Type == NotificationType.GrantInterestReceived))
            .OrderByDescending(n => n.CreationTime)
            .First(n => n.Title.Contains("Unvan Programı"));

        notification.Title.ShouldContain("Unvanlı Gençlik ve Spor Derneği");
    }

    [Fact]
    public async Task Kiracinin_talebi_baska_kiraciya_sizmaz()
    {
        var call = await CreateHostCallAsync("Sızıntı Kontrolü Programı");
        var tenantA = await CreateTenantAsync("Talep Bırakan " + Guid.NewGuid().ToString("N")[..6]);
        var tenantB = await CreateTenantAsync("Diğer Firma " + Guid.NewGuid().ToString("N")[..6]);

        Guid interestId;
        using (_currentTenant.Change(tenantA))
        {
            interestId = (await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Proje fikri", ProblemStatement = "Sorun" })).Id;
        }

        using (_currentTenant.Change(tenantB))
        {
            (await _interestAppService.GetMineAsync()).ShouldNotContain(i => i.Id == interestId);
        }
    }

    [Fact]
    public async Task Konsorsiyum_sartli_cagrida_ortak_cevabi_zorunlu_ve_saklanir()
    {
        var consortiumCall = await CreateHostCallAsync("Ortaklık Şartlı Program", requiresConsortium: true);
        var plainCall = await CreateHostCallAsync("Şartsız Program");
        var tenantId = await CreateTenantAsync("Ortak Arayan " + Guid.NewGuid().ToString("N")[..6]);

        using (_currentTenant.Change(tenantId))
        {
            (await Should.ThrowAsync<BusinessException>(() => _interestAppService.ExpressAsync(
                    new ExpressGrantInterestInput { GrantCallId = consortiumCall.Id, Note = "Fikir", ProblemStatement = "Sorun" })))
                .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestPartnerAnswerRequired);

            var answered = await _interestAppService.ExpressAsync(new ExpressGrantInterestInput
            {
                GrantCallId = consortiumCall.Id,
                Note = "Öngörülü bakım modülü",
                ProblemStatement = "Sorun",
                EstimatedBudget = 12_500_000m,
                TargetStartDate = new DateTime(2027, 1, 1),
                NeedsPartner = true
            });
            answered.NeedsPartner.ShouldBe(true);
            answered.EstimatedBudget.ShouldBe(12_500_000m);
            answered.TargetStartDate.ShouldBe(new DateTime(2027, 1, 1));

            // Şartsız çağrıda soru ekranda hiç çıkmaz; gelen cevap SAKLANMAZ.
            var plain = await _interestAppService.ExpressAsync(new ExpressGrantInterestInput
            {
                GrantCallId = plainCall.Id,
                Note = "Fikir",
                ProblemStatement = "Sorun",
                NeedsPartner = false,
                PartnerName = "Uydurma Ortak"
            });
            plain.NeedsPartner.ShouldBeNull();
            plain.PartnerName.ShouldBeNull();
        }

        // Host kutusu yeni alanları görür.
        var row = (await _hostAppService.GetAsync(onlyPending: true)).Items
            .Single(i => i.GrantCallId == consortiumCall.Id);
        row.Note.ShouldBe("Öngörülü bakım modülü");
        row.NeedsPartner.ShouldBe(true);
        row.EstimatedBudget.ShouldBe(12_500_000m);
    }

    [Fact]
    public async Task Ilgi_bildirilen_cagri_takibe_alinir_ve_ikinci_satir_acilmaz()
    {
        var call = await CreateHostCallAsync("Takip Programı");
        var tenantId = await CreateTenantAsync("Takipçi Firma " + Guid.NewGuid().ToString("N")[..6]);

        using (_currentTenant.Change(tenantId))
        {
            var first = await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Fikir", ProblemStatement = "Sorun" });
            (await _bookmarkRepository.GetListAsync(b => b.GrantCallId == call.Id)).Count.ShouldBe(1);

            // Geri çek + yeniden bildir: takip satırı çoğalmamalı.
            await _interestAppService.WithdrawAsync(first.Id);
            await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Fikir, ikinci kez", ProblemStatement = "Sorun" });
            (await _bookmarkRepository.GetListAsync(b => b.GrantCallId == call.Id)).Count.ShouldBe(1);
        }
    }

    [Fact]
    public async Task Geri_cekilen_talep_kutuda_bekleyen_sayilmaz_ve_baslatilamaz()
    {
        var call = await CreateHostCallAsync("Vazgeçilen Program");
        var tenantId = await CreateTenantAsync("Vazgeçen Firma " + Guid.NewGuid().ToString("N")[..6]);

        Guid interestId;
        using (_currentTenant.Change(tenantId))
        {
            interestId = (await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Fikir", ProblemStatement = "Sorun" })).Id;

            var withdrawn = await _interestAppService.WithdrawAsync(interestId);
            withdrawn.Status.ShouldBe(GrantInterestStatus.GeriCekildi);
            withdrawn.WithdrawnAt.ShouldNotBeNull();
        }

        (await _hostAppService.GetAsync(onlyPending: true)).Items.ShouldNotContain(i => i.Id == interestId);
        (await _hostAppService.GetAsync(onlyPending: false)).Items
            .Single(i => i.Id == interestId).Status.ShouldBe(GrantInterestStatus.GeriCekildi);

        (await Should.ThrowAsync<BusinessException>(() => _hostAppService.StartApplicationAsync(interestId)))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);

        using (_currentTenant.Change(tenantId))
        {
            (await _applicationRepository.GetListAsync(a => a.GrantCallId == call.Id)).Count.ShouldBe(0);
        }
    }

    [Fact]
    public async Task Baska_kiracinin_talebi_geri_cekilemez()
    {
        var call = await CreateHostCallAsync("Yabancı Talep Programı");
        var tenantA = await CreateTenantAsync("Sahip Firma " + Guid.NewGuid().ToString("N")[..6]);
        var tenantB = await CreateTenantAsync("Yabancı Firma " + Guid.NewGuid().ToString("N")[..6]);

        Guid interestId;
        using (_currentTenant.Change(tenantA))
        {
            interestId = (await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Fikir", ProblemStatement = "Sorun" })).Id;
        }

        using (_currentTenant.Change(tenantB))
        {
            (await Should.ThrowAsync<BusinessException>(() => _interestAppService.WithdrawAsync(interestId)))
                .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestNotFound);
        }

        using (_currentTenant.Change(tenantA))
        {
            (await _interestRepository.GetAsync(interestId)).Status.ShouldBe(GrantInterestStatus.Yeni);
        }
    }

    [Fact]
    public async Task Ayni_cagriya_ikinci_kez_ilgi_bildirilemez()
    {
        var call = await CreateHostCallAsync("Mükerrer Talep Programı");
        var tenantId = await CreateTenantAsync("Israrcı Firma " + Guid.NewGuid().ToString("N")[..6]);

        using (_currentTenant.Change(tenantId))
        {
            await _interestAppService.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Proje fikri", ProblemStatement = "Sorun" });

            (await Should.ThrowAsync<BusinessException>(
                    () => _interestAppService.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Proje fikri", ProblemStatement = "Sorun" })))
                .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyOpen);
        }
    }

    [Fact]
    public async Task Uygun_bulunmayan_talepten_sonra_yeniden_ilgi_bildirilebilir()
    {
        var call = await CreateHostCallAsync("Yeniden Bildirim Programı");
        var tenantId = await CreateTenantAsync("Düzelen Firma " + Guid.NewGuid().ToString("N")[..6]);

        Guid firstId;
        using (_currentTenant.Change(tenantId))
        {
            firstId = (await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Proje fikri", ProblemStatement = "Sorun" })).Id;
        }

        await _hostAppService.RejectAsync(new RejectGrantInterestInput
        {
            InterestId = firstId,
            Reason = "Konsorsiyum ortağınız yok."
        });

        using (_currentTenant.Change(tenantId))
        {
            // Red kapıyı kapatmaz: YENİ kayıt açılır, eski gerekçe geçmişte kalır.
            var second = await _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Proje fikri", ProblemStatement = "Sorun" });
            second.Id.ShouldNotBe(firstId);

            var mine = await _interestAppService.GetMineAsync();
            mine.Single(i => i.Id == firstId).HostFeedback.ShouldBe("Konsorsiyum ortağınız yok.");
            mine.Single(i => i.Id == second.Id).Status.ShouldBe(GrantInterestStatus.Yeni);
        }
    }

    // ---------- 18a · İnceleme ekranı ----------

    /// <summary>Devredilecek danışman: host bağlamında etkin kullanıcı.</summary>
    private async Task<Guid> CreateHostUserAsync(string name)
    {
        _currentTenant.Id.ShouldBeNull();
        var manager = GetRequiredService<IdentityUserManager>();
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var user = new IdentityUser(Guid.NewGuid(), "danisman-" + suffix, $"danisman-{suffix}@apya.test") { Name = name };
        (await manager.CreateAsync(user)).Succeeded.ShouldBeTrue();
        return user.Id;
    }

    private async Task<Guid> ExpressAsync(Guid tenantId, Guid callId, bool? needsPartner)
    {
        using (_currentTenant.Change(tenantId))
        {
            var dto = await _interestAppService.ExpressAsync(new ExpressGrantInterestInput
            {
                GrantCallId = callId,
                Note = "Öngörülü bakım modülü",
                ProblemStatement = "Sorun",
                EstimatedBudget = 12_500_000m,
                NeedsPartner = needsPartner
            });
            return dto.Id;
        }
    }

    /// <summary>
    /// Ortaklık gereken talepte aynı çağrıya ilgi bildirmiş DİĞER firmalar önerilir; talebin
    /// kendi firması önerilmez. Proje fikri, uyum ve eksik şartlar tek yükte gelir.
    /// </summary>
    [Fact]
    public async Task Inceleme_ekrani_fikir_firma_ve_ortak_onerisini_tek_yukte_doner()
    {
        var call = await CreateHostCallAsync("Ortaklık İsteyen Program", requiresConsortium: true);
        var firmA = await CreateTenantAsync("Akım Teknoloji " + Guid.NewGuid().ToString("N")[..6]);
        var firmB = await CreateTenantAsync("Vektör Yazılım " + Guid.NewGuid().ToString("N")[..6]);

        var interestA = await ExpressAsync(firmA, call.Id, needsPartner: true);
        var interestB = await ExpressAsync(firmB, call.Id, needsPartner: true);

        var review = await _hostAppService.GetReviewAsync(interestA);

        review.Interest.Id.ShouldBe(interestA);
        review.Interest.Note.ShouldBe("Öngörülü bakım modülü");
        review.Interest.EstimatedBudget.ShouldBe(12_500_000m);
        review.RequiresConsortium.ShouldBeTrue();
        review.MatchScore.ShouldBeInRange(0, 100);
        // Profil boş: ortaklık şartı ölçülemez, eksik olarak görünür.
        (review.FailedRules.Count + review.UnknownRules.Count).ShouldBeGreaterThan(0);

        review.PartnerSuggestions.ShouldContain(p => p.InterestId == interestB && p.NeedsPartner == true);
        review.PartnerSuggestions.ShouldNotContain(p => p.TenantId == firmA, "talebin kendi firması ortak önerilmez");
    }

    /// <summary>🔴 İç not firmaya GİTMEZ: kiracı DTO'sunda böyle bir alan bulunmamalı.</summary>
    [Fact]
    public async Task Danisman_notu_kaydedilir_ve_firmanin_dtosunda_yer_almaz()
    {
        typeof(MyGrantInterestDto).GetProperty("ConsultantNote").ShouldBeNull("iç not kiracıya taşınmamalı");

        var call = await CreateHostCallAsync("Not Programı");
        var firm = await CreateTenantAsync("Not Firması " + Guid.NewGuid().ToString("N")[..6]);
        var interestId = await ExpressAsync(firm, call.Id, needsPartner: null);

        var saved = await _hostAppService.SaveNoteAsync(new SaveGrantInterestNoteInput { InterestId = interestId, Note = "  1501 önceliğiyle örtüşüyor  " });
        saved.ConsultantNote.ShouldBe("1501 önceliğiyle örtüşüyor");

        var cleared = await _hostAppService.SaveNoteAsync(new SaveGrantInterestNoteInput { InterestId = interestId, Note = "   " });
        cleared.ConsultantNote.ShouldBeNull();
    }

    /// <summary>
    /// Devret yalnız etkin HOST kullanıcısına ve yalnız bekleyen talepte. Sorumlu gelen kutusu
    /// satırında da görünür; danışman listesi yükü (bekleyen talep sayısı) taşır.
    /// </summary>
    [Fact]
    public async Task Talep_yalniz_host_danismanina_ve_beklerken_devredilir()
    {
        var call = await CreateHostCallAsync("Devir Programı");
        var firm = await CreateTenantAsync("Devir Firması " + Guid.NewGuid().ToString("N")[..6]);
        var interestId = await ExpressAsync(firm, call.Id, needsPartner: null);
        var consultantId = await CreateHostUserAsync("Selin Bakır");

        var review = await _hostAppService.AssignAsync(new AssignGrantInterestInput { InterestId = interestId, UserId = consultantId });
        review.Interest.AssignedUserId.ShouldBe(consultantId);
        review.Interest.AssignedUserName.ShouldBe("Selin Bakır");
        review.Consultants.Single(c => c.UserId == consultantId).AssignedCount.ShouldBeGreaterThanOrEqualTo(1);

        (await _hostAppService.GetAsync(onlyPending: true)).Items.Single(i => i.Id == interestId)
            .AssignedUserName.ShouldBe("Selin Bakır");

        var unknown = await Should.ThrowAsync<BusinessException>(() =>
            _hostAppService.AssignAsync(new AssignGrantInterestInput { InterestId = interestId, UserId = Guid.NewGuid() }));
        unknown.Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAssigneeNotFound);

        await _hostAppService.RejectAsync(new RejectGrantInterestInput { InterestId = interestId, Reason = "Kapsam dışı." });
        var closed = await Should.ThrowAsync<BusinessException>(() =>
            _hostAppService.AssignAsync(new AssignGrantInterestInput { InterestId = interestId, UserId = consultantId }));
        closed.Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
    }

    /// <summary>İncelemeye alan danışman, sorumlu yoksa sorumlu olur; varsa üzerine yazmaz.</summary>
    [Fact]
    public void Incelemeye_alan_danisman_bos_sorumlulugu_ustlenir()
    {
        var first = Guid.NewGuid();
        var second = Guid.NewGuid();

        var unassigned = new GrantInterest(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), null, "fikir");
        unassigned.StartReview(first, DateTime.Now);
        unassigned.AssignedUserId.ShouldBe(first);

        var assigned = new GrantInterest(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), null, "fikir");
        assigned.AssignTo(second);
        assigned.StartReview(first, DateTime.Now);
        assigned.AssignedUserId.ShouldBe(second, "devredilmiş talebi inceleyen sorumluluğu devralmaz");
    }

    /// <summary>
    /// Tur 19: proje fikri formunun 2-9. soruları talebe yazılır ve danışman inceleme ekranının
    /// satırına gelir; boş bırakılan soru null döner, boş dize değil. 2. soru servis kapısında
    /// zorunludur — yalnız ekranda değil, REST'ten de atlanamaz.
    /// </summary>
    [Fact]
    public async Task Fikir_formu_cevaplari_talebe_yazilir_ve_inceleme_ekranina_gelir()
    {
        var call = await CreateHostCallAsync("Dokuz Soru Programı");
        var tenantId = await CreateTenantAsync("Soru Cevap A.Ş. " + Guid.NewGuid().ToString("N")[..6]);

        Guid interestId;
        using (_currentTenant.Change(tenantId))
        {
            await Should.ThrowAsync<AbpValidationException>(() => _interestAppService.ExpressAsync(
                new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Fikir", ProblemStatement = "  " }));

            var mine = await _interestAppService.ExpressAsync(new ExpressGrantInterestInput
            {
                GrantCallId = call.Id,
                Note = "Öngörülü bakım modülü",
                ProblemStatement = " Arıza kayıtları elle tutuluyor ",
                TargetAudience = "KOBİ üretim tesisleri",
                PlannedActivities = "Saha çalışması, yazılım geliştirme",
                DurationAndPartners = "12 ay; OSB müdürlüğü",
                SupportNeeds = "Bütçelendirme",
                PriorExperience = "",
                TeamStructure = "2 makine mühendisi, 3 yazılımcı",
                Stakeholders = null
            });
            interestId = mine.Id;

            mine.ProblemStatement.ShouldBe("Arıza kayıtları elle tutuluyor");
            mine.PriorExperience.ShouldBeNull("boş bırakılan soru null döner");
            mine.Stakeholders.ShouldBeNull();
        }

        var review = await _hostAppService.GetReviewAsync(interestId);
        review.Interest.ProblemStatement.ShouldBe("Arıza kayıtları elle tutuluyor");
        review.Interest.TargetAudience.ShouldBe("KOBİ üretim tesisleri");
        review.Interest.PlannedActivities.ShouldBe("Saha çalışması, yazılım geliştirme");
        review.Interest.DurationAndPartners.ShouldBe("12 ay; OSB müdürlüğü");
        review.Interest.SupportNeeds.ShouldBe("Bütçelendirme");
        review.Interest.PriorExperience.ShouldBeNull();
        review.Interest.TeamStructure.ShouldBe("2 makine mühendisi, 3 yazılımcı");
        review.Interest.Stakeholders.ShouldBeNull();
    }
}
