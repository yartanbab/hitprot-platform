using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Shouldly;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// FIN-12 · SÖZLEŞME: proje listesi bütçe rakamını konsol ve Finans Merkezi ile AYNI kaynaktan gösterir.
///
/// <para>Liste "Bütçe" diye emek maliyetini (zaman kaydı × saatlik ücret) proje bütçesine
/// oranlıyordu; konsol gider toplamını kalem toplamına. Aynı proje listede ₺0, konsolda
/// ₺1.088.363 görünebiliyordu. Ölçü: listedeki iki rakam bütçe özetinin iki rakamına eşittir.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectListBudgetSource_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectAppService _projects;
    private readonly IProjectBudgetAppService _budget;
    private readonly IExpenseAppService _expenses;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<CashAccount, Guid> _accountRepository;

    public ProjectListBudgetSource_Tests()
    {
        _projects = GetRequiredService<IProjectAppService>();
        _budget = GetRequiredService<IProjectBudgetAppService>();
        _expenses = GetRequiredService<IExpenseAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _accountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
    }

    private async Task<Guid> ProjectWithExpensesAsync(params decimal[] amounts)
    {
        // Saatlik ücret dolu: eski hesap (zaman kaydı × ücret) burada 0 verirdi.
        var project = new Project(
            Guid.NewGuid(), null, null, "Liste bütçesi", "LBK-" + Guid.NewGuid().ToString("N")[..8], "",
            1_000_000m, 250m, "TRY");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var account = new CashAccount(Guid.NewGuid(), "Liste kasası", currency: "TRY");
        await _accountRepository.InsertAsync(account, autoSave: true);

        foreach (var amount in amounts)
        {
            await _expenses.CreateAsync(new CreateUpdateExpenseDto
            {
                Title = "Liste gideri",
                Amount = amount,
                Currency = "TRY",
                ExpenseDate = new DateTime(2026, 10, 13),
                CashAccountId = account.Id,
                ProjectId = project.Id
            });
        }

        return project.Id;
    }

    private async Task<ProjectDto> ListRowAsync(Guid projectId)
        => (await _projects.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 }))
            .Items.Single(p => p.Id == projectId);

    [Fact]
    public async Task Kalemsiz_projede_liste_gider_toplamini_ve_proje_butcesini_gosterir()
    {
        var id = await ProjectWithExpensesAsync(300_000m, 200_000m);

        var row = await ListRowAsync(id);
        var overview = await _budget.GetOverviewAsync(id);

        row.SpentBudget.ShouldBe(500_000m);
        row.SpentBudget.ShouldBe(overview.SpentAmount);
        row.TotalBudget.ShouldBe(overview.ApprovedBudget);
        row.TotalBudget.ShouldBe(1_000_000m);
    }

    [Fact]
    public async Task Kalemli_projede_liste_butcesi_kalem_toplamidir()
    {
        var id = await ProjectWithExpensesAsync(120_000m);
        await _budget.CreateLineAsync(id, new CreateUpdateBudgetLineDto { Code = "1", Name = "Personel", PlannedAmount = 400_000m });
        await _budget.CreateLineAsync(id, new CreateUpdateBudgetLineDto { Code = "2", Name = "Makine", PlannedAmount = 250_000m });

        var row = await ListRowAsync(id);
        var overview = await _budget.GetOverviewAsync(id);

        overview.HasBudgetLines.ShouldBeTrue();
        row.TotalBudget.ShouldBe(overview.ApprovedBudget);
        row.TotalBudget.ShouldBe(650_000m);
        row.SpentBudget.ShouldBe(overview.SpentAmount);
    }

    [Fact]
    public async Task Ozet_seridinin_toplam_butcesi_kalem_toplamlarini_kullanir()
    {
        var before = (await _projects.GetProjectsSummaryAsync()).TotalBudget;

        var id = await ProjectWithExpensesAsync();
        await _budget.CreateLineAsync(id, new CreateUpdateBudgetLineDto { Code = "1", Name = "Personel", PlannedAmount = 400_000m });

        // Proje alanı 1.000.000 ama kalem toplamı 400.000: şerit konsolun gösterdiğini toplar.
        ((await _projects.GetProjectsSummaryAsync()).TotalBudget - before).ShouldBe(400_000m);
    }
}
