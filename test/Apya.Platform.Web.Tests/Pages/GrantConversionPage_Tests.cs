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
}
