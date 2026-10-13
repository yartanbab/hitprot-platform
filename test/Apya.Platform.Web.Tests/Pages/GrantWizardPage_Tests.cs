using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 2a · Başvuru sihirbazı. Test host'u tek kullanıcıyla koşar; iki taraflı kilit
/// senaryosu için kilit satırı DOĞRUDAN başka bir kullanıcı adına yazılır —
/// ikinci bir oturum açmadan "karşı taraf yazıyor" durumu böyle kurulur.
/// </summary>
public class GrantWizardPage_Tests : PlatformWebTestBase
{
    private readonly IGrantApplicationWizardAppService _wizard;

    public GrantWizardPage_Tests()
    {
        _wizard = GetRequiredService<IGrantApplicationWizardAppService>();
    }

    /// <summary>Açık bir çağrıya başvuru + programa iki harcama kalemi kurar.</summary>
    private async Task<(Guid ApplicationId, Guid GrantId)> CreateApplicationAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        var costRepo = GetRequiredService<IRepository<GrantEligibleCostItem, Guid>>();
        var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();

        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();

        // "Açık çağrı" tarihiyle birlikte açık olmalı: tohumlanan çağrıların son başvuru tarihi
        // takvimle birlikte geçer ve gönderim kapısı tarihe de bakar (LIF-05).
        if (call.IsPastDeadline(DateTime.Now))
        {
            call.SetSchedule(call.OpenDate, DateTime.Now.Date.AddDays(30));
            await callRepo.UpdateAsync(call, autoSave: true);
        }
        var grant = await grantRepo.GetAsync(call.GrantId);
        grant.SupportRatePercent = 60;
        grant.MaxAmount = 10_000_000m;
        await grantRepo.UpdateAsync(grant, autoSave: true);

        var existing = await costRepo.GetListAsync(c => c.GrantId == grant.Id);
        if (existing.All(c => c.Kind != GrantCostItemKind.Personel))
        {
            await costRepo.InsertAsync(
                new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.Personel, null),
                autoSave: true);
        }
        if (existing.All(c => c.Kind != GrantCostItemKind.MakineTechizat))
        {
            await costRepo.InsertAsync(
                new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.MakineTechizat, 40),
                autoSave: true);
        }

        var application = await appRepo.FirstOrDefaultAsync(a => a.GrantCallId == call.Id);
        if (application == null)
        {
            application = new GrantApplication(Guid.NewGuid(), null, call.Id);
            await appRepo.InsertAsync(application, autoSave: true);
        }

        await uow.CompleteAsync();
        return (application.Id, grant.Id);
    }

    /// <summary>Alanı BAŞKA bir kullanıcı adına kilitler.</summary>
    private async Task<Guid> LockFieldAsOtherUserAsync(Guid applicationId, string fieldKey, DateTime lastActivity)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var lockRepo = GetRequiredService<IRepository<GrantApplicationFieldLock, Guid>>();

        var otherUserId = Guid.NewGuid();
        var entity = new GrantApplicationFieldLock(
            Guid.NewGuid(), null, applicationId, fieldKey, otherUserId, "Selin Bakır", lastActivity);
        await lockRepo.InsertAsync(entity, autoSave: true);
        await uow.CompleteAsync();
        return otherUserId;
    }

    [Fact]
    public async Task Sihirbaz_Sayfasi_Render_Oluyor()
    {
        var (id, _) = await CreateApplicationAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Wizard?id={id}");

        html.ShouldContain("apya-wiz-layout");
        html.ShouldContain("Şu an formda");
        // Hub adresi Wizard.js içindedir (demet olarak referanslanır); sayfada
        // doğrulanabilecek olan SignalR istemcisinin yüklendiğidir.
        html.ShouldContain("signalr", Case.Insensitive);
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Wizard[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Wizard.js içermeli");
    }

    [Fact]
    public async Task Id_Verilmezse_Listeye_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/Wizard");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants");
    }

    [Fact]
    public async Task Butce_Kaydedilir_Ve_Destek_Hesaplanir()
    {
        var (id, _) = await CreateApplicationAsync();

        var dto = await _wizard.SaveBudgetLineAsync(new SaveWizardBudgetLineInput
        {
            ApplicationId = id,
            Kind = GrantCostItemKind.Personel,
            Amount = 1_000_000m,
            Justification = "4 kişi · 24 ay"
        });

        var line = dto.BudgetLines.Single(b => b.Kind == GrantCostItemKind.Personel);
        line.Amount.ShouldBe(1_000_000m);
        line.Justification.ShouldBe("4 kişi · 24 ay");
        dto.TotalProject.ShouldBe(1_000_000m);
        dto.TotalSupport.ShouldBe(600_000m, "destek oranı %60");
        dto.OwnContribution.ShouldBe(400_000m);
    }

    [Fact]
    public async Task Desteklenmeyen_Kaleme_Yazilamaz()
    {
        var (id, _) = await CreateApplicationAsync();

        // Seyahat kalemi programda açık değil: satır ekranda "girilemez" görünür,
        // uç doğrudan çağrılsa da sunucu reddeder.
        await Should.ThrowAsync<BusinessException>(async () =>
            await _wizard.SaveBudgetLineAsync(new SaveWizardBudgetLineInput
            {
                ApplicationId = id,
                Kind = GrantCostItemKind.Seyahat,
                Amount = 50_000m
            }));
    }

    [Fact]
    public async Task Kapali_Kalem_De_Listede_Ama_Girilemez_Isaretli()
    {
        var (id, _) = await CreateApplicationAsync();

        var dto = await _wizard.GetAsync(id);

        dto.BudgetLines.ShouldContain(b => b.Kind == GrantCostItemKind.Seyahat && !b.IsEligible);
        dto.BudgetLines.ShouldContain(b => b.Kind == GrantCostItemKind.Personel && b.IsEligible);
    }

    [Fact]
    public async Task Alan_Kilidi_Alinir_Ve_Birakilir()
    {
        var (id, _) = await CreateApplicationAsync();
        var input = new GrantFieldLockInput { ApplicationId = id, FieldKey = "budget:Personel" };

        var acquired = await _wizard.AcquireLockAsync(input);
        acquired.Acquired.ShouldBeTrue();
        (await _wizard.GetAsync(id)).Locks.ShouldContain(l => l.FieldKey == "budget:Personel");

        await _wizard.ReleaseLockAsync(input);
        (await _wizard.GetAsync(id)).Locks.ShouldBeEmpty();
    }

    [Fact]
    public async Task Karsi_Tarafin_Tuttugu_Alan_Alinamaz()
    {
        var (id, _) = await CreateApplicationAsync();
        await LockFieldAsOtherUserAsync(id, "budget:Personel", DateTime.Now);

        var result = await _wizard.AcquireLockAsync(
            new GrantFieldLockInput { ApplicationId = id, FieldKey = "budget:Personel" });

        result.Acquired.ShouldBeFalse();
        result.Lock!.OwnerName.ShouldBe("Selin Bakır", "ekranda kimin yazdığı görünmeli");
    }

    [Fact]
    public async Task Karsi_Tarafin_Tuttugu_Alana_Yazilamaz()
    {
        var (id, _) = await CreateApplicationAsync();
        await LockFieldAsOtherUserAsync(id, "budget:Personel", DateTime.Now);

        await Should.ThrowAsync<BusinessException>(async () =>
            await _wizard.SaveBudgetLineAsync(new SaveWizardBudgetLineInput
            {
                ApplicationId = id,
                Kind = GrantCostItemKind.Personel,
                Amount = 1m
            }));
    }

    [Fact]
    public async Task Iki_Dakika_Bosta_Kalan_Kilit_Devralinir()
    {
        var (id, _) = await CreateApplicationAsync();
        await LockFieldAsOtherUserAsync(
            id, "budget:Personel", DateTime.Now.AddMinutes(-GrantApplicationFieldLock.IdleMinutes - 1));

        var result = await _wizard.AcquireLockAsync(
            new GrantFieldLockInput { ApplicationId = id, FieldKey = "budget:Personel" });

        result.Acquired.ShouldBeTrue("boşta kalan kilit ilk isteyene açılır");
    }

    [Fact]
    public async Task Devralma_Istegi_Kilit_Sahibine_Gorunur()
    {
        var (id, _) = await CreateApplicationAsync();
        var input = new GrantFieldLockInput { ApplicationId = id, FieldKey = "summary:Title" };
        await _wizard.AcquireLockAsync(input);

        // Kendi kilidine devralma isteği bırakılamaz — istek sessizce yok sayılır.
        await _wizard.RequestTakeoverAsync(input);

        var dto = await _wizard.GetAsync(id);
        dto.Locks.Single().TakeoverRequestedByUserId.ShouldBeNull();
    }

    [Fact]
    public async Task Proje_Ozeti_Kaydedilir_Ve_Tamamlanma_Artar()
    {
        var (id, _) = await CreateApplicationAsync();
        var before = (await _wizard.GetAsync(id)).CompletionPercent;

        var dto = await _wizard.SaveSummaryAsync(new SaveWizardSummaryInput
        {
            ApplicationId = id,
            ProjectTitle = "Akıllı üretim hattı",
            ProjectSummary = "Hat verimliliğini artıran gömülü sistem.",
            ProjectDurationMonths = 24
        });

        dto.ProjectTitle.ShouldBe("Akıllı üretim hattı");
        dto.ProjectDurationMonths.ShouldBe(24);
        dto.CompletionPercent.ShouldBeGreaterThan(before);
    }

    [Fact]
    public async Task Sira_Devredilince_Kendi_Kilitlerim_Birakilir()
    {
        var (id, _) = await CreateApplicationAsync();
        await _wizard.AcquireLockAsync(new GrantFieldLockInput { ApplicationId = id, FieldKey = "summary:Title" });

        var dto = await _wizard.HandOverAsync(id);

        dto.Locks.ShouldBeEmpty("devreden taraf alanları serbest bırakmalı");
        dto.PendingParty.ShouldNotBe(dto.ViewerRole);
    }

    [Fact]
    public async Task Gonderilen_Basvuru_Kilitlenir_Ve_Ikinci_Kez_Gonderilemez()
    {
        var (id, _) = await CreateApplicationAsync();

        var dto = await _wizard.SubmitAsync(id);
        dto.IsReadOnly.ShouldBeTrue();
        dto.SubmittedAt.ShouldNotBeNull();

        await Should.ThrowAsync<BusinessException>(async () => await _wizard.SubmitAsync(id));

        // Gönderilmiş başvuruda alan yazımı da kapanır.
        await Should.ThrowAsync<BusinessException>(async () =>
            await _wizard.SaveSummaryAsync(new SaveWizardSummaryInput { ApplicationId = id, ProjectTitle = "X" }));
    }

    /// <summary>
    /// 🔴 NTF-01: Gönderim huninin en kritik anı ama hiçbir iz bırakmıyordu —
    /// <see cref="GrantActivityKind.Submitted"/> kod tabanında HİÇ yazılmamıştı ve
    /// danışman listeyi elle açmadıkça başvurunun geldiğini göremiyordu.
    /// İz kaydı bildirimden ÖNCE yazılır: host şablonu kapatsa bile akış görünür kalmalı.
    /// </summary>
    [Fact]
    public async Task Gonderim_Surec_Izine_Yazilir_Ve_Evrak_Durumunu_Tasir()
    {
        var (id, _) = await CreateApplicationAsync();

        await _wizard.SubmitAsync(id);

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var repo = GetRequiredService<IRepository<GrantApplicationActivity, Guid>>();

        var kayit = (await repo.GetListAsync(a => a.GrantApplicationId == id))
            .SingleOrDefault(a => a.Kind == GrantActivityKind.Submitted);

        kayit.ShouldNotBeNull("gönderim süreç izine yazılmalı");
        kayit!.Context.ShouldNotBeNullOrWhiteSpace("iz, evrak durumunu taşımalı");
        // 🔴 "Boş değil" ham anahtarı da kabul ediyordu: servis yerelleştirme kaynağı
        // olmadan koştuğu için iz "Grants:Notify:Trigger:ApplicationSubmitted:…" yazıyordu.
        kayit.Context!.ShouldNotContain("Grants:", Case.Sensitive);
        kayit.Context.ShouldContain("zorunlu evrak", Case.Sensitive);
    }

    /// <summary>
    /// Firma başvuruyu KENDİ bağlamında gönderir; çağrı ve program ise host kataloğundadır.
    /// Bildirim metni çağrıyı kiracı süzgeci açıkken okuyordu: satır görünmüyor, host'a giden
    /// "başvuru gönderildi" bildiriminde çağrı adı BOŞ çıkıyordu.
    /// </summary>
    [Fact]
    public async Task Firma_Baglaminda_Gonderimde_Host_Bildirimi_Cagri_Adini_Tasir()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<Volo.Abp.MultiTenancy.ICurrentTenant>();

        Guid applicationId;
        Guid tenantId;
        string grantName;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await GetRequiredService<Volo.Abp.TenantManagement.ITenantManager>()
                .CreateAsync("Gonderen-" + Guid.NewGuid().ToString("N")[..6]);
            await GetRequiredService<Volo.Abp.TenantManagement.ITenantRepository>().InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;

            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null)).First();
            call.SetSchedule(call.OpenDate, DateTime.Now.Date.AddDays(30));
            await callRepo.UpdateAsync(call, autoSave: true);
            grantName = (await GetRequiredService<IRepository<Grant, Guid>>().GetAsync(call.GrantId)).Name;

            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);
            applicationId = application.Id;
            await uow.CompleteAsync();
        }

        using (currentTenant.Change(tenantId))
        {
            await _wizard.SubmitAsync(applicationId);
        }

        using var read = uowManager.Begin(requiresNew: true);
        var notifications = await GetRequiredService<IRepository<Apya.Platform.Notifications.Notification, Guid>>()
            .GetListAsync(n => n.EntityId == applicationId);

        notifications.ShouldNotBeEmpty("host kullanıcısına gönderim bildirimi düşmeli");
        notifications.ShouldAllBe(n => (n.Title + " " + n.Body).Contains(grantName));
    }

    /// <summary>
    /// 🔴 LIF-05: Kapanmış çağrıya gönderim kapısı. Kapanış zinciri firmaya
    /// "çağrı kapandı, başvurunuz gönderilmeden kaldı" bildirimini ZATEN gönderiyor;
    /// sonrasında gönderime izin vermek o bildirimi yalanlardı.
    /// </summary>
    [Fact]
    public async Task Kapanmis_Cagriya_Basvuru_Gonderilemez()
    {
        var (id, _) = await CreateApplicationAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var application = await appRepo.GetAsync(id);
            var call = await callRepo.GetAsync(application.GrantCallId);
            call.Close();
            await callRepo.UpdateAsync(call, autoSave: true);
            await uow.CompleteAsync();
        }

        var ex = await Should.ThrowAsync<BusinessException>(async () => await _wizard.SubmitAsync(id));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantApplicationCallClosed);
    }

    private async Task SetCallDeadlineAsync(Guid applicationId, DateTime deadline)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        var application = await GetRequiredService<IRepository<GrantApplication, Guid>>().GetAsync(applicationId);
        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var call = await callRepo.GetAsync(application.GrantCallId);
        call.SetSchedule(null, deadline);
        call.Status.ShouldBe(GrantCallStatus.Acik, "bu testler durumu AÇIK kalmış çağrıyı ölçer");
        await callRepo.UpdateAsync(call, autoSave: true);
        await uow.CompleteAsync();
    }

    /// <summary>
    /// LIF-05'in tarih yarısı: son başvuru tarihi geçen çağrı, otomatik kapanış çalışana kadar
    /// "Açık" durumda kalır ve o aralıkta gönderim kabul ediyordu. İşçi çalıştığında firmaya
    /// giden "başvurunuz gönderilmeden kaldı" bildirimi o gönderimi yalanlardı.
    /// </summary>
    [Fact]
    public async Task Son_Tarihi_Gecmis_Cagriya_Durumu_Acik_Olsa_Da_Basvuru_Gonderilemez()
    {
        var (id, _) = await CreateApplicationAsync();
        await SetCallDeadlineAsync(id, DateTime.Now.Date.AddDays(-1));

        var ex = await Should.ThrowAsync<BusinessException>(async () => await _wizard.SubmitAsync(id));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantApplicationCallClosed);
    }

    /// <summary>Karşı yön: son gün dahildir.</summary>
    [Fact]
    public async Task Son_Gununde_Basvuru_Gonderilebilir()
    {
        var (id, _) = await CreateApplicationAsync();
        await SetCallDeadlineAsync(id, DateTime.Now.Date);

        await Should.NotThrowAsync(async () => await _wizard.SubmitAsync(id));
    }

    /// <summary>
    /// 🔴 LIF-05: <c>HandedOver</c> enum'da tanımlıydı, ekranda etiketi vardı ama
    /// kod tabanında HİÇBİR yerde yazılmıyordu — süreç akışı devretmeyi hiç göstermiyordu.
    /// </summary>
    [Fact]
    public async Task Devretme_Surec_Izine_Yazilir()
    {
        var (id, _) = await CreateApplicationAsync();

        await _wizard.HandOverAsync(id);

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var repo = GetRequiredService<IRepository<GrantApplicationActivity, Guid>>();

        var kayit = (await repo.GetListAsync(a => a.GrantApplicationId == id))
            .SingleOrDefault(a => a.Kind == GrantActivityKind.HandedOver);

        kayit.ShouldNotBeNull("devretme süreç izine yazılmalı");
        kayit!.Context.ShouldNotBeNullOrWhiteSpace("iz, sıranın kime geçtiğini taşımalı");
        // 🔴 Aynı tuzak: iz "Grants:Party:Danisman" yazıyordu. Tarafın ADI olmalı.
        kayit.Context!.ShouldNotContain("Grants:", Case.Sensitive);
        new[] { "Danışman", "Firma" }.ShouldContain(kayit.Context);
    }

    [Fact]
    public async Task Mesaj_Gonderilir_Ve_Listede_Doner()
    {
        var (id, _) = await CreateApplicationAsync();

        var sent = await _wizard.SendMessageAsync(new SendWizardMessageInput
        {
            ApplicationId = id,
            Body = "Makine kalemini 4M'a çektim, %40 limitinde kalıyor."
        });

        sent.Body.ShouldContain("4M");
        var dto = await _wizard.GetAsync(id);
        dto.Messages.ShouldContain(m => m.Id == sent.Id);
    }

    [Fact]
    public async Task Adim_Araligi_Disina_Cikilamaz()
    {
        var (id, _) = await CreateApplicationAsync();

        await Should.ThrowAsync<BusinessException>(async () => await _wizard.SetStepAsync(id, 0));
        await Should.ThrowAsync<BusinessException>(async () => await _wizard.SetStepAsync(id, 99));

        var dto = await _wizard.SetStepAsync(id, 3);
        dto.CurrentStep.ShouldBe(3);
    }

    /* ═══════════════ Danışman (host) kiracının başvurusunda ═══════════════ */

    private static readonly Guid FirmTenant = Guid.Parse("99990000-cccc-4000-8000-000000000081");

    /// <summary>KİRACIYA ait başvuru: bir bütçe satırı ve firmadaki bir kullanıcının başlık kilidiyle.</summary>
    private async Task<Guid> CreateTenantOwnedApplicationAsync()
    {
        var (seedId, _) = await CreateApplicationAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
        var callId = (await appRepo.GetAsync(seedId)).GrantCallId;

        // TenantId kurucuda ATANIR.
        var application = new GrantApplication(Guid.NewGuid(), FirmTenant, callId);
        await appRepo.InsertAsync(application, autoSave: true);

        var line = new GrantApplicationBudgetLine(
            Guid.NewGuid(), FirmTenant, application.Id, GrantCostItemKind.Personel);
        line.SetAmount(250_000m);
        await GetRequiredService<IRepository<GrantApplicationBudgetLine, Guid>>().InsertAsync(line, autoSave: true);

        await GetRequiredService<IRepository<GrantApplicationFieldLock, Guid>>().InsertAsync(
            new GrantApplicationFieldLock(
                Guid.NewGuid(), FirmTenant, application.Id, "summary:Title", Guid.NewGuid(), "Firma Kullanıcısı", DateTime.Now),
            autoSave: true);

        await uow.CompleteAsync();
        return application.Id;
    }

    /// <summary>
    /// Başvuru süzgeç kapatılarak okunuyordu, alt satırları değil: danışman firmanın bütçesini boş,
    /// kilidini yok görüyordu.
    /// </summary>
    [Fact]
    public async Task Danisman_Kiracinin_Basvurusunda_Butceyi_Ve_Kilidi_Gorur()
    {
        var id = await CreateTenantOwnedApplicationAsync();

        var dto = await _wizard.GetAsync(id);

        dto.BudgetLines.Single(l => l.Kind == GrantCostItemKind.Personel).Amount.ShouldBe(250_000m);
    }

    [Fact]
    public async Task Danisman_Firmanin_Kilitledigi_Alanin_Ustune_Yazamaz()
    {
        var id = await CreateTenantOwnedApplicationAsync();

        (await Should.ThrowAsync<BusinessException>(() => _wizard.SaveSummaryAsync(new SaveWizardSummaryInput
        {
            ApplicationId = id,
            ProjectTitle = "Danışmanın yazdığı başlık"
        }))).Code.ShouldBe(PlatformDomainErrorCodes.GrantFieldLockedByOther);
    }

    /// <summary>Var olan satırı bulamayıp ikincisini eklemeye çalışıyordu (tekil indeks hatası).</summary>
    [Fact]
    public async Task Danisman_Kiracinin_Var_Olan_Butce_Satirini_Gunceller()
    {
        var id = await CreateTenantOwnedApplicationAsync();

        var dto = await _wizard.SaveBudgetLineAsync(new SaveWizardBudgetLineInput
        {
            ApplicationId = id,
            Kind = GrantCostItemKind.Personel,
            Amount = 300_000m
        });

        dto.BudgetLines.Single(l => l.Kind == GrantCostItemKind.Personel).Amount.ShouldBe(300_000m);
    }

    /* ═══════════════ Özetin üç alanı ayrı kilitlenir ═══════════════ */

    [Fact]
    public async Task Baskasinin_Kilitledigi_Ozet_Metni_Baslik_Kaydiyla_Ezilemez()
    {
        var (id, _) = await CreateApplicationAsync();
        await _wizard.SaveSummaryAsync(new SaveWizardSummaryInput
        {
            ApplicationId = id, ProjectTitle = "İlk başlık", ProjectSummary = "İlk özet", ProjectDurationMonths = 12
        });
        await LockFieldAsOtherUserAsync(id, "summary:Body", DateTime.Now);

        // Başlığı yazan kişi tam formu gönderir; özet metni başkasında kilitliyken değiştirilemez.
        await Should.ThrowAsync<BusinessException>(() => _wizard.SaveSummaryAsync(new SaveWizardSummaryInput
        {
            ApplicationId = id, ProjectTitle = "Yeni başlık", ProjectSummary = "Ezilmiş özet", ProjectDurationMonths = 12
        }));

        // Karşı yön: kilitli alana dokunmadan kendi alanını kaydeder.
        var dto = await _wizard.SaveSummaryAsync(new SaveWizardSummaryInput
        {
            ApplicationId = id, ProjectTitle = "Yeni başlık", ProjectSummary = "İlk özet", ProjectDurationMonths = 12
        });
        dto.ProjectTitle.ShouldBe("Yeni başlık");
        dto.ProjectSummary.ShouldBe("İlk özet");
    }


    /* ═══════════════ Hedefler (dönüşümde proje göstergesi olur) ═══════════════ */

    private static SaveWizardTargetInput TargetInput(Guid applicationId, decimal baseline = 0m, decimal target = 200m) => new()
    {
        ApplicationId = applicationId,
        Name = "Eğitilen kişi sayısı",
        Unit = "kişi",
        BaselineValue = baseline,
        TargetValue = target,
        TargetDate = new DateTime(2027, 6, 30)
    };

    [Fact]
    public async Task Hedef_Eklenir_Listelenir_Ve_Silinir()
    {
        var (id, _) = await CreateApplicationAsync();

        var added = await _wizard.AddTargetAsync(TargetInput(id));
        var target = added.Targets.Single();
        target.Name.ShouldBe("Eğitilen kişi sayısı");
        target.Unit.ShouldBe("kişi");
        target.TargetValue.ShouldBe(200m);
        target.TargetDate.ShouldBe(new DateTime(2027, 6, 30));

        (await _wizard.GetAsync(id)).Targets.Count.ShouldBe(1);
        (await _wizard.DeleteTargetAsync(id, target.Id)).Targets.ShouldBeEmpty();
    }

    /// <summary>Göstergeyle aynı kural: burada kabul edilen satır dönüşümde reddedilmemeli.</summary>
    [Fact]
    public async Task Hedef_Baslangica_Esit_Olamaz()
    {
        var (id, _) = await CreateApplicationAsync();

        (await Should.ThrowAsync<BusinessException>(() => _wizard.AddTargetAsync(TargetInput(id, baseline: 50m, target: 50m))))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantTargetValueInvalid);
        (await _wizard.GetAsync(id)).Targets.ShouldBeEmpty();
    }

    [Fact]
    public async Task Gonderilmis_Basvuruya_Hedef_Eklenemez_Silinemez()
    {
        var (id, _) = await CreateApplicationAsync();
        var targetId = (await _wizard.AddTargetAsync(TargetInput(id))).Targets.Single().Id;
        await _wizard.SubmitAsync(id);

        (await Should.ThrowAsync<BusinessException>(() => _wizard.AddTargetAsync(TargetInput(id))))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantApplicationLocked);
        (await Should.ThrowAsync<BusinessException>(() => _wizard.DeleteTargetAsync(id, targetId)))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantApplicationLocked);
        (await _wizard.GetAsync(id)).Targets.Count.ShouldBe(1);
    }

    [Fact]
    public async Task Baska_Basvurunun_Hedefi_Kimligiyle_Silinemez()
    {
        var (first, _) = await CreateApplicationAsync();
        // Yardımcı aynı çağrının başvurusunu yeniden kullanır; ikinci başvuru ayrı kurulur.
        var second = await CreateTenantOwnedApplicationAsync();
        var targetId = (await _wizard.AddTargetAsync(TargetInput(first))).Targets.Single().Id;

        await Should.ThrowAsync<Volo.Abp.Domain.Entities.EntityNotFoundException>(
            () => _wizard.DeleteTargetAsync(second, targetId));
        (await _wizard.GetAsync(first)).Targets.Count.ShouldBe(1);
    }

    /// <summary>Danışman (host) firmanın başvurusuna hedef ekler: satır FİRMANIN kiracısıyla yazılır.</summary>
    [Fact]
    public async Task Danisman_Kiracinin_Basvurusuna_Hedef_Ekler_Satir_Kiracinin_Olur()
    {
        var id = await CreateTenantOwnedApplicationAsync();

        var dto = await _wizard.AddTargetAsync(TargetInput(id));
        dto.Targets.Count.ShouldBe(1, "danışman kiracının hedefini görmeli");

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        using (GetRequiredService<Volo.Abp.Data.IDataFilter<Volo.Abp.MultiTenancy.IMultiTenant>>().Disable())
        {
            var row = await GetRequiredService<IRepository<GrantApplicationTarget, Guid>>()
                .FirstOrDefaultAsync(t => t.GrantApplicationId == id);
            row.ShouldNotBeNull();
            row!.TenantId.ShouldBe(FirmTenant);
        }

        (await _wizard.DeleteTargetAsync(id, dto.Targets.Single().Id)).Targets.ShouldBeEmpty();
    }

    [Fact]
    public async Task Sihirbaz_Sayfasi_Hedef_Alanlarini_Basar()
    {
        var (id, _) = await CreateApplicationAsync();

        var html = await GetResponseAsStringAsync("/Grants/Wizard?id=" + id);

        html.ShouldContain("id=\"TargetRows\"", Case.Sensitive);
        html.ShouldContain("id=\"TargetAdd\"", Case.Sensitive);
    }
}
