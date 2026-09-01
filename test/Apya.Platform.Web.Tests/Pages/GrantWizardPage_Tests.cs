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
}
