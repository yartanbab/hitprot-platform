using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Documents;
using Apya.Platform.Expenses;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Finans panellerinin sunucu sözleşmeleri (birleşik sekme sistemi PR-3b):
/// 2a — proje panelinin gider satırları (görev başlığı + belge durumu +
/// toplamlar); 2b — /Tasks çapraz-proje gruplama (ara toplamlar sunucudan,
/// Genel gider ayrı ve SONDA, para birimi başına toplam — kur uydurulmaz).
/// </summary>
public class FinancePanels_Tests : PlatformWebTestBase
{
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IExpenseAppService _expenseAppService;

    public FinancePanels_Tests()
    {
        _budgetAppService = GetRequiredService<IProjectBudgetAppService>();
        _expenseAppService = GetRequiredService<IExpenseAppService>();
    }

    private sealed record Seeded(Guid P1, Guid P2, Guid Task, Guid Cash, Guid DocExpense);

    private async Task<Seeded> SeedAsync(string code)
    {
        var p1 = Guid.NewGuid(); var p2 = Guid.NewGuid();
        var taskId = Guid.NewGuid(); var cashId = Guid.NewGuid();
        var e1 = Guid.NewGuid(); var e2 = Guid.NewGuid(); var e3 = Guid.NewGuid(); var e4 = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var projects = GetRequiredService<IRepository<Project, Guid>>();
            await projects.InsertAsync(new Project(p1, null, null, "Fin P1 " + code, code + "-1", "test"), autoSave: true);
            await projects.InsertAsync(new Project(p2, null, null, "Fin P2 " + code, code + "-2", "test"), autoSave: true);

            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            await tasks.InsertAsync(new TaskItem(taskId, "Fin görevi", projectId: p1, startDate: DateTime.Today), autoSave: true);

            var accounts = GetRequiredService<IRepository<CashAccount, Guid>>();
            await accounts.InsertAsync(new CashAccount(cashId, "Fin kasa " + code), autoSave: true);

            var expenses = GetRequiredService<IRepository<Expense, Guid>>();
            // P1: görevli ₺1000 (belgeli olacak) + görevsiz ₺500.
            await expenses.InsertAsync(new Expense(e1, "Görevli gider", 1000m, cashId, DateTime.Today, ExpenseCategory.Service, "TRY", projectId: p1, taskId: taskId), autoSave: true);
            await expenses.InsertAsync(new Expense(e2, "Proje gideri", 500m, cashId, DateTime.Today.AddDays(-1), ExpenseCategory.Office, "TRY", projectId: p1), autoSave: true);
            // P2: EUR gider — para birimi ayrımı için.
            await expenses.InsertAsync(new Expense(e3, "Avro gider", 250m, cashId, DateTime.Today, ExpenseCategory.Travel, "EUR", projectId: p2), autoSave: true);
            // Bağımsız (Genel gider): projesiz + görevsiz.
            await expenses.InsertAsync(new Expense(e4, "Kargo", 940m, cashId, DateTime.Today, ExpenseCategory.Other, "TRY"), autoSave: true);

            // e1 için evrak eşleşmesi — HasDocument/Belgesiz ayrımı.
            var matches = GetRequiredService<IRepository<DocumentExpenseMatch, Guid>>();
            await matches.InsertAsync(new DocumentExpenseMatch(
                Guid.NewGuid(), null, Guid.NewGuid(), e1, 100, MatchSource.Manual), autoSave: true);

            await uow.CompleteAsync();
        }

        return new Seeded(p1, p2, taskId, cashId, e1);
    }

    [Fact]
    public async Task Proje_paneli_satirlari_gorev_basligi_ve_belge_durumuyla_gelir()
    {
        var s = await SeedAsync("FIN-A");

        var panel = await _budgetAppService.GetExpensePanelAsync(s.P1);

        panel.Rows.Count.ShouldBe(2);
        var gorevli = panel.Rows.Single(r => r.TaskId == s.Task);
        gorevli.TaskTitle.ShouldBe("Fin görevi");
        gorevli.HasDocument.ShouldBeTrue();
        panel.Rows.Single(r => r.TaskId == null).HasDocument.ShouldBeFalse();

        panel.Total.ShouldBe(1500m);
        panel.TaskLinkedTotal.ShouldBe(1000m);
        panel.TaskLinkedCount.ShouldBe(1);
        panel.TaskLinkedTaskCount.ShouldBe(1);
        // Belgesiz = eşleşmesi olmayan tek kayıt (₺500).
        panel.UndocumentedTotal.ShouldBe(500m);
        panel.UndocumentedCount.ShouldBe(1);
    }

    [Fact]
    public async Task Capraz_proje_gruplama_genel_gider_sonda_ve_para_birimi_basina_toplam()
    {
        var s = await SeedAsync("FIN-B");

        var d = await _expenseAppService.GetProjectGroupedAsync(new GetExpensesInput { MaxResultCount = 1000 });

        // Bu tenant'ta başka testlerin kayıtları da olabilir — kendi kayıtlarımıza bakarız.
        var g1 = d.Groups.Single(g => g.ProjectId == s.P1);
        g1.TotalCount.ShouldBe(2);
        g1.Totals.Single(t => t.Currency == "TRY").Total.ShouldBe(1500m);
        g1.Rows.Select(r => r.Title).ShouldContain("Görevli gider");
        g1.Rows.Single(r => r.Title == "Görevli gider").TaskTitle.ShouldBe("Fin görevi");

        var g2 = d.Groups.Single(g => g.ProjectId == s.P2);
        g2.Totals.Single().Currency.ShouldBe("EUR");
        g2.Totals.Single().Total.ShouldBe(250m);

        // Genel gider: ProjectId boş grup, EN SONDA.
        var pool = d.Groups.Last();
        pool.ProjectId.ShouldBeNull();
        pool.ProjectName.ShouldBe("Genel gider");
        pool.Rows.Select(r => r.Title).ShouldContain("Kargo");

        // Genel toplamlar para birimi başına — EUR ₺'ye karıştırılmaz.
        d.GrandTotals.Select(t => t.Currency).ShouldContain("EUR");
        d.GrandTotals.Single(t => t.Currency == "EUR").Total.ShouldBe(250m);
    }

    [Fact]
    public async Task Proje_suzgeci_tek_grup_dondurur()
    {
        var s = await SeedAsync("FIN-C");

        var d = await _expenseAppService.GetProjectGroupedAsync(
            new GetExpensesInput { ProjectId = s.P1, MaxResultCount = 1000 });

        d.Groups.ShouldHaveSingleItem();
        d.Groups[0].ProjectId.ShouldBe(s.P1);
        d.GrandTotals.Single(t => t.Currency == "TRY").Total.ShouldBe(1500m);
    }
}
