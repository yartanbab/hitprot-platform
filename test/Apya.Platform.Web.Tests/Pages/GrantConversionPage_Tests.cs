using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 2e · Onay → projeye dönüştürme. Kiracıya ait bir başvuru kurar; dönüştürmenin
/// projeyi KİRACININ bağlamında yazdığını ve tekrarlanamadığını doğrular.
/// </summary>
public class GrantConversionPage_Tests : PlatformWebTestBase
{
    private readonly IGrantApplicationConversionAppService _conversion;

    public GrantConversionPage_Tests()
    {
        _conversion = GetRequiredService<IGrantApplicationConversionAppService>();
    }

    /// <summary>Kiracı + onaylanmış başvuru + bütçe + milestone + dilim kurar.</summary>
    private async Task<(Guid ApplicationId, Guid TenantId)> SetupAsync(decimal? approvedAmount = 1_000_000m)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();
        var currentTenant = GetRequiredService<ICurrentTenant>();

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await tenantManager.CreateAsync("Donusum-" + Guid.NewGuid().ToString("N")[..6]);
            await tenantRepo.InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        Guid applicationId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
            var costRepo = GetRequiredService<IRepository<GrantEligibleCostItem, Guid>>();
            var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
            var budgetRepo = GetRequiredService<IRepository<GrantApplicationBudgetLine, Guid>>();
            var milestoneRepo = GetRequiredService<IRepository<GrantMilestone, Guid>>();
            var trancheRepo = GetRequiredService<IRepository<GrantDisbursementTranche, Guid>>();

            var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
            var grant = await grantRepo.GetAsync(call.GrantId);
            grant.SupportRatePercent = 50;
            grant.MaxAmount = 10_000_000m;
            await grantRepo.UpdateAsync(grant, autoSave: true);

            if ((await costRepo.GetListAsync(c => c.GrantId == grant.Id))
                .All(c => c.Kind != GrantCostItemKind.Personel))
            {
                await costRepo.InsertAsync(
                    new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.Personel, null),
                    autoSave: true);
            }

            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            if (approvedAmount.HasValue)
            {
                application.AdvanceStage(GrantApplicationStage.Onay, approvedAmount);
            }
            await appRepo.InsertAsync(application, autoSave: true);
            applicationId = application.Id;

            var line = new GrantApplicationBudgetLine(
                Guid.NewGuid(), tenantId, application.Id, GrantCostItemKind.Personel);
            line.SetAmount(600_000m);
            await budgetRepo.InsertAsync(line, autoSave: true);

            await milestoneRepo.InsertAsync(
                new GrantMilestone(Guid.NewGuid(), tenantId, application.Id, "Kickoff", DateTime.Now.AddDays(30)),
                autoSave: true);
            await trancheRepo.InsertAsync(
                new GrantDisbursementTranche(Guid.NewGuid(), tenantId, application.Id, 1, 400_000m,
                    DateTime.Now.AddDays(60)),
                autoSave: true);

            await uow.CompleteAsync();
        }

        return (applicationId, tenantId);
    }

    private static ConvertGrantApplicationInput Input(Guid id) => new()
    {
        ApplicationId = id,
        ProjectName = "Akıllı üretim hattı",
        StartDate = DateTime.Now.Date,
        EndDate = DateTime.Now.Date.AddMonths(24),
        BudgetLines =
        {
            new ConvertGrantBudgetLineInput
            {
                Kind = GrantCostItemKind.Personel,
                Name = "Personel gideri",
                Amount = 600_000m,
                Category = ExpenseCategory.Personnel
            }
        }
    };

    [Fact]
    public async Task Donusturme_Sayfasi_Render_Oluyor()
    {
        var (id, _) = await SetupAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Convert?id={id}");

        html.ShouldContain("apya-cv-layout");
        html.ShouldContain("Aktarılacaklar");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Convert[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Convert.js içermeli");
    }

    [Fact]
    public async Task Id_Verilmezse_Panoya_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/Convert");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants/Pipeline");
    }

    [Fact]
    public async Task Onizleme_Eslemeleri_Ve_Aktarilacaklari_Doner()
    {
        var (id, _) = await SetupAsync();

        var preview = await _conversion.GetPreviewAsync(id);

        preview.CanConvert.ShouldBeTrue();
        preview.SuggestedProjectCode.ShouldStartWith("PRJ-");
        preview.BudgetMappings.ShouldContain(m => m.Kind == GrantCostItemKind.Personel
                                                  && m.SuggestedCategory == ExpenseCategory.Personnel);
        preview.Tasks.ShouldContain(t => t.Title == "Kickoff");
        preview.Tranches.ShouldContain(t => t.SequenceNo == 1);
        // 400.000 / 1.000.000 = %40
        preview.Tranches.Single().SharePercent.ShouldBe(40);
    }

    [Fact]
    public async Task Onaylanan_Tutar_Yoksa_Donusturulemez()
    {
        var (id, _) = await SetupAsync(approvedAmount: null);

        var preview = await _conversion.GetPreviewAsync(id);
        preview.CanConvert.ShouldBeFalse("onaylanan destek girilmeden proje bütçesi kurulamaz");

        await Should.ThrowAsync<BusinessException>(async () => await _conversion.ConvertAsync(Input(id)));
    }

    /// <summary>
    /// CNV-03: Tutar tek başına "kabul edildi" değildir. Hiçbir akış reddedilen başvurunun
    /// onaylanan tutarını temizlemediği için, tutarı önce girilmiş sonra reddedilmiş bir
    /// başvuru projeye dönüşebiliyordu — durum makinesinde "ret → proje" yolu açıktı.
    /// </summary>
    [Fact]
    public async Task Reddedilmis_Basvuru_Donusturulemez()
    {
        var (id, tenantId) = await SetupAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        using (var uow = uowManager.Begin(requiresNew: true))
        using (currentTenant.Change(tenantId))
        {
            var decisionRepo = GetRequiredService<IRepository<GrantDecision, Guid>>();
            await decisionRepo.InsertAsync(
                new GrantDecision(Guid.NewGuid(), tenantId, id,
                    GrantDecisionOutcome.Reddedildi, DateTime.Now.Date, referenceNo: null,
                    appealDeadline: null),
                autoSave: true);
            await uow.CompleteAsync();
        }

        var ex = await Should.ThrowAsync<BusinessException>(
            async () => await _conversion.ConvertAsync(Input(id)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantConversionRejected);
    }

    /// <summary>
    /// CNV-11 + CNV-04: Dönüşen proje "Hibe Projesi" kategorisiyle doğmalı — kategori
    /// geçilmediğinde proje "Diğer/Genel" oluyor, Finans Merkezi sekme setini kategoriden
    /// türettiği için donör ve kur köprüsü sekmeleri hiç basılmıyordu. Başvuruda yazılmış
    /// özet de projeye taşınmalı; aksi hâlde kullanıcı aynı metni ikinci kez giriyor.
    /// </summary>
    [Fact]
    public async Task Donusen_Proje_Hibe_Kategorisi_Ve_Ozeti_Alir()
    {
        var (id, tenantId) = await SetupAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        using (var uow = uowManager.Begin(requiresNew: true))
        using (currentTenant.Change(tenantId))
        {
            var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
            var application = await appRepo.GetAsync(id);
            application.SetProjectSummary("Akıllı üretim", "Üretim hattının dijitalleştirilmesi", 24);
            await appRepo.UpdateAsync(application, autoSave: true);
            await uow.CompleteAsync();
        }

        var result = await _conversion.ConvertAsync(Input(id));

        using (var uow = uowManager.Begin(requiresNew: true))
        using (currentTenant.Change(tenantId))
        {
            var projectRepo = GetRequiredService<IRepository<Project, Guid>>();
            var project = await projectRepo.GetAsync(result.ProjectId);

            project.CategoryId.ShouldBe(ProjectCategoryConsts.SystemIds.GrantProject,
                "hibe projesi 'Diğer/Genel' ile doğarsa kur köprüsü sekmesi hiç görünmez");
            project.Purpose.ShouldBe("Üretim hattının dijitalleştirilmesi",
                "başvuruda yazılmış özet projede tekrar sorulmamalı");
        }
    }

    [Fact]
    public async Task Bos_Esleme_Reddedilir()
    {
        var (id, _) = await SetupAsync();
        var input = Input(id);
        input.BudgetLines.Clear();

        await Should.ThrowAsync<BusinessException>(async () => await _conversion.ConvertAsync(input));
    }

    [Fact]
    public async Task Proje_Kiracinin_Baglaminda_Olusur()
    {
        var (id, tenantId) = await SetupAsync();

        var result = await _conversion.ConvertAsync(Input(id));

        result.ProjectCode.ShouldStartWith("PRJ-");
        result.BudgetLineCount.ShouldBe(1);
        result.TaskCount.ShouldBe(1);
        result.TrancheCount.ShouldBe(1);

        var currentTenant = GetRequiredService<ICurrentTenant>();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        using (currentTenant.Change(tenantId))
        {
            var projectRepo = GetRequiredService<IRepository<Project, Guid>>();
            var budgetRepo = GetRequiredService<IRepository<ProjectBudgetLine, Guid>>();
            var taskRepo = GetRequiredService<IRepository<TaskItem, Guid>>();
            var fundingRepo = GetRequiredService<IRepository<FundingTranche, Guid>>();

            // 🔴 Kiracı bağlamında görünmeli: host bağlamında yazılsaydı kiracı kendi
            // projesini göremezdi.
            var project = await projectRepo.FirstOrDefaultAsync(p => p.Id == result.ProjectId);
            project.ShouldNotBeNull();
            project!.TenantId.ShouldBe(tenantId);
            project.Name.ShouldBe("Akıllı üretim hattı");

            (await budgetRepo.GetListAsync(b => b.ProjectId == result.ProjectId)).Count.ShouldBe(1);
            (await taskRepo.GetListAsync(t => t.ProjectId == result.ProjectId)).Count.ShouldBe(1);
            (await fundingRepo.GetListAsync(f => f.ProjectId == result.ProjectId)).Count.ShouldBe(1);
        }
    }

    [Fact]
    public async Task Ikinci_Kez_Donusturulemez_Ve_Basvuru_Kapanmaz()
    {
        var (id, _) = await SetupAsync();

        var result = await _conversion.ConvertAsync(Input(id));

        await Should.ThrowAsync<BusinessException>(async () => await _conversion.ConvertAsync(Input(id)));

        var preview = await _conversion.GetPreviewAsync(id);
        preview.ProjectId.ShouldBe(result.ProjectId);
        preview.CanConvert.ShouldBeFalse();

        // Başvuru KAPANMAZ: gönderim damgası dönüştürmeden etkilenmez.
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
        var mtFilter = GetRequiredService<Volo.Abp.Data.IDataFilter<IMultiTenant>>();
        using (mtFilter.Disable())
        {
            var application = await appRepo.GetAsync(id);
            application.ProjectId.ShouldBe(result.ProjectId);
            application.SubmittedAt.ShouldBeNull("dönüştürme başvuruyu göndermez/kapatmaz");
        }
    }

    [Fact]
    public async Task Plan_Aktarimi_Kapatilabilir()
    {
        var (id, _) = await SetupAsync();
        var input = Input(id);
        input.CreateTasks = false;
        input.CreateTranches = false;

        var result = await _conversion.ConvertAsync(input);

        result.TaskCount.ShouldBe(0);
        result.TrancheCount.ShouldBe(0);
        result.BudgetLineCount.ShouldBe(1, "bütçe kalemleri her hâlükârda kurulur");
    }

    /// <summary>
    /// 🔴 NTF-02: Dönüşüm ne iz ne bildirim üretiyordu — sürecin en sevindirici
    /// geçişi firma için tamamen sessizdi ve zaman çizelgesi başvurunun projeye
    /// döndüğü anı hiç göstermiyordu. İz kaydı bildirimden ÖNCE yazılır: host
    /// şablonu kapatsa bile akış görünür kalmalı.
    /// </summary>
    [Fact]
    public async Task Donusum_Surec_Izine_Yazilir()
    {
        var (id, _) = await SetupAsync();

        var result = await _conversion.ConvertAsync(Input(id));

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var activityRepo = GetRequiredService<IRepository<GrantApplicationActivity, Guid>>();
        var mtFilter = GetRequiredService<Volo.Abp.Data.IDataFilter<IMultiTenant>>();

        using (mtFilter.Disable())
        {
            var kayit = (await activityRepo.GetListAsync(a => a.GrantApplicationId == id))
                .SingleOrDefault(a => a.Kind == GrantActivityKind.ConvertedToProject);

            kayit.ShouldNotBeNull("dönüşüm süreç izine yazılmalı");
            kayit!.Context.ShouldContain(result.ProjectCode, Case.Insensitive);
        }
    }

    /// <summary>
    /// 🔴 CNV-05: Proje bütçesi İSTEMCİ BEYANIYLA kuruluyordu. Uç doğrudan
    /// çağrılabildiği için beyan edilen tutar başvurunun gerçek kaydıyla hiç
    /// karşılaştırılmıyordu; şişirilmiş bir tutar sessizce proje bütçesi olurdu.
    /// </summary>
    [Fact]
    public async Task Bütce_Tutari_Istemciden_Degil_Sunucudan_Okunur()
    {
        var (id, tenantId) = await SetupAsync();

        var input = Input(id);
        input.BudgetLines[0].Amount = 9_999_999m;   // başvuruda 600.000 yazıyor

        var result = await _conversion.ConvertAsync(input);

        var currentTenant = GetRequiredService<ICurrentTenant>();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        using (currentTenant.Change(tenantId))
        {
            var budgetRepo = GetRequiredService<IRepository<ProjectBudgetLine, Guid>>();
            var saved = (await budgetRepo.GetListAsync(b => b.ProjectId == result.ProjectId)).Single();

            saved.PlannedAmount.ShouldBe(600_000m, "tutar başvurunun kendi kaydından gelmeli");
            saved.ApprovedAmount.ShouldBe(600_000m);
            saved.Name.ShouldBe("Personel gideri", "ad istemciden gelmeye devam eder");

            var projectRepo = GetRequiredService<IRepository<Project, Guid>>();
            (await projectRepo.GetAsync(result.ProjectId)).TotalBudget.ShouldBe(600_000m);
        }
    }

    /// <summary>Başvuruda karşılığı olmayan kalem sessizce atlanmaz, dönüşüm reddedilir.</summary>
    [Fact]
    public async Task Basvuruda_Olmayan_Kalem_Donusumu_Durdurur()
    {
        var (id, _) = await SetupAsync();

        var input = Input(id);
        input.BudgetLines[0].Kind = GrantCostItemKind.Seyahat;   // başvuruda yalnız Personel var

        var ex = await Should.ThrowAsync<BusinessException>(() => _conversion.ConvertAsync(input));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantConversionBudgetLineUnknown);
    }

    /// <summary>
    /// 🔴 CNV-06: Tamamlanmış kilometre taşı da AÇIK göreve çevriliyordu — geçmişte
    /// biten iş panoda yapılacak gibi listeleniyordu. Atlanmıyor, KAPALI açılıyor:
    /// iş gerçekten yapıldı, proje o izi korumalı.
    /// </summary>
    [Fact]
    public async Task Tamamlanmis_Kilometre_Tasi_Kapali_Gorev_Olarak_Acilir()
    {
        var (id, tenantId) = await SetupAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();

        // Kilometre taşı kiracıya aittir; host bağlamında okunursa filtre onu gizler.
        using (var uow = uowManager.Begin(requiresNew: true))
        using (currentTenant.Change(tenantId))
        {
            var milestoneRepo = GetRequiredService<IRepository<GrantMilestone, Guid>>();
            var milestone = (await milestoneRepo.GetListAsync(m => m.GrantApplicationId == id)).Single();
            milestone.Complete();
            await milestoneRepo.UpdateAsync(milestone, autoSave: true);
            await uow.CompleteAsync();
        }

        var result = await _conversion.ConvertAsync(Input(id));
        using var readUow = uowManager.Begin(requiresNew: true);
        using (currentTenant.Change(tenantId))
        {
            var taskRepo = GetRequiredService<IRepository<TaskItem, Guid>>();
            var task = (await taskRepo.GetListAsync(t => t.ProjectId == result.ProjectId)).Single();

            task.Status.ShouldBe(Apya.Platform.Tasks.TaskStatus.Done,
                "tamamlanmış kilometre taşı yapılacak iş gibi görünmemeli");
            task.CompletedDate.ShouldNotBeNull();
        }
    }

    /// <summary>
    /// 🔴 CNV-10: Kalem kodu gider kategorisinin ENUM ADIydı. Aynı kategoriye düşen
    /// iki kalem (SarfMalzeme + MakineTechizat → Material) AYNI kodu alıyordu; kod
    /// proje içinde tekil olmak zorunda olduğu için kullanıcı o kalemi sonradan
    /// düzenlemek istediğinde BudgetLineCodeAlreadyExists ile kilitleniyordu.
    /// </summary>
    [Fact]
    public async Task Ayni_Kategoriye_Dusen_Iki_Kalem_Farkli_Kod_Alir()
    {
        var (id, tenantId) = await SetupAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();

        // Başvuruya ikinci bir kalem: farklı tür, AYNI gider kategorisi.
        using (var uow = uowManager.Begin(requiresNew: true))
        using (currentTenant.Change(tenantId))
        {
            var budgetRepo = GetRequiredService<IRepository<GrantApplicationBudgetLine, Guid>>();
            var extra = new GrantApplicationBudgetLine(
                Guid.NewGuid(), tenantId, id, GrantCostItemKind.SarfMalzeme);
            extra.SetAmount(150_000m);
            await budgetRepo.InsertAsync(extra, autoSave: true);
            await uow.CompleteAsync();
        }

        var input = Input(id);
        input.BudgetLines.Add(new ConvertGrantBudgetLineInput
        {
            Kind = GrantCostItemKind.SarfMalzeme,
            Name = "Sarf malzeme",
            Amount = 150_000m,
            Category = ExpenseCategory.Material
        });
        input.BudgetLines[0].Category = ExpenseCategory.Material;   // ikisi de aynı kategori

        var result = await _conversion.ConvertAsync(input);

        using var readUow = uowManager.Begin(requiresNew: true);
        using (currentTenant.Change(tenantId))
        {
            var budgetRepo = GetRequiredService<IRepository<ProjectBudgetLine, Guid>>();
            var codes = (await budgetRepo.GetListAsync(b => b.ProjectId == result.ProjectId))
                .Select(b => b.Code).ToList();

            codes.Count.ShouldBe(2);
            codes.ShouldBeUnique("kod proje içinde tekil olmalı");
            codes.ShouldNotContain("Material", "Türkçe arayüzde İngilizce enum adı görünmemeli");
        }
    }

    /// <summary>
    /// 🔴 CNV-08: İkinci dönüşüm ancak HER ŞEY yazıldıktan sonra yakalanıyordu. İşlem
    /// geri alınıyordu ama o ana kadar proje, bütçe, görev ve gelir planı boşuna
    /// yazılıyor, sıralı proje kodu da boşa harcanıyordu.
    /// </summary>
    [Fact]
    public async Task Ikinci_Donusum_Hicbir_Sey_Yazmadan_Reddedilir()
    {
        var (id, tenantId) = await SetupAsync();
        var first = await _conversion.ConvertAsync(Input(id));

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var currentTenant = GetRequiredService<ICurrentTenant>();

        int projectCountBefore;
        using (var uow = uowManager.Begin(requiresNew: true))
        using (currentTenant.Change(tenantId))
        {
            var projectRepo = GetRequiredService<IRepository<Project, Guid>>();
            projectCountBefore = (await projectRepo.GetListAsync()).Count;
        }

        var ex = await Should.ThrowAsync<BusinessException>(() => _conversion.ConvertAsync(Input(id)));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantApplicationAlreadyConverted);

        using var readUow = uowManager.Begin(requiresNew: true);
        using (currentTenant.Change(tenantId))
        {
            var projectRepo = GetRequiredService<IRepository<Project, Guid>>();
            var projects = await projectRepo.GetListAsync();

            projects.Count.ShouldBe(projectCountBefore, "reddedilen dönüşüm proje yazmamalı");
            projects.ShouldContain(p => p.Id == first.ProjectId);
        }
    }
}
