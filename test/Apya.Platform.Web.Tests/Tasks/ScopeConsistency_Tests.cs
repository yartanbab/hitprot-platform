using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Hiyerarşik kapsam tutarlılığı (birleşik sekme sistemi PR-3a). Buradaki
/// kurallar yanlışsa hata SESSİZDİR: "görev A projesinde, harcaması B
/// projesinin bütçesinde" gibi kayıtlar toplamları çelişkiye düşürür ve kimse
/// hata almaz. Üç kural sabitlenir: (1) TaskId dolu kayıtta ProjectId görevden
/// türetilir, istemci değeri yok sayılır; (2) görev taşınınca finans kayıtları
/// projeyi izler; (3) "İlişkiyi değiştir" (SetScope) bağımsıza alınca kayıt
/// hiçbir bütçeye sayılmaz ve kalem bağı düşer.
/// </summary>
public class ScopeConsistency_Tests : PlatformWebTestBase
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly IProjectBudgetAppService _budgetAppService;

    public ScopeConsistency_Tests()
    {
        _expenseAppService = GetRequiredService<IExpenseAppService>();
        _taskAppService = GetRequiredService<ITaskAppService>();
        _budgetAppService = GetRequiredService<IProjectBudgetAppService>();
    }

    private sealed record Seeded(Guid P1, Guid P2, Guid Task, Guid CashAccount);

    private async Task<Seeded> SeedAsync(string code)
    {
        var p1 = Guid.NewGuid(); var p2 = Guid.NewGuid();
        var taskId = Guid.NewGuid(); var cashId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var projects = GetRequiredService<IRepository<Project, Guid>>();
            await projects.InsertAsync(new Project(p1, null, null, "Kapsam P1 " + code, code + "-1", "test"), autoSave: true);
            await projects.InsertAsync(new Project(p2, null, null, "Kapsam P2 " + code, code + "-2", "test"), autoSave: true);

            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            await tasks.InsertAsync(
                new TaskItem(taskId, "Kapsam görevi", projectId: p1, startDate: DateTime.Today), autoSave: true);

            var accounts = GetRequiredService<IRepository<CashAccount, Guid>>();
            await accounts.InsertAsync(new CashAccount(cashId, "Kasa " + code), autoSave: true);

            await uow.CompleteAsync();
        }

        return new Seeded(p1, p2, taskId, cashId);
    }

    private static CreateUpdateExpenseDto ExpenseInput(Seeded s, Guid? taskId, Guid? projectId, decimal amount = 100m)
        => new()
        {
            Title = "Test harcaması",
            Amount = amount,
            Currency = "TRY",
            ExpenseDate = DateTime.Today,
            CashAccountId = s.CashAccount,
            TaskId = taskId,
            ProjectId = projectId
        };

    [Fact]
    public async Task Gorevli_kayitta_ProjectId_gorevden_turetilir_istemci_degeri_yok_sayilir()
    {
        var s = await SeedAsync("SCP-A");

        // İstemci BİLEREK yanlış proje gönderiyor (P2); görev P1'de.
        var dto = await _expenseAppService.CreateAsync(ExpenseInput(s, taskId: s.Task, projectId: s.P2));

        dto.ProjectId.ShouldBe(s.P1, "kapsam kuralı: TaskId doluysa proje görevden türetilir");
        (await _budgetAppService.GetOverviewAsync(s.P1)).SpentAmount.ShouldBe(100m);
        (await _budgetAppService.GetOverviewAsync(s.P2)).SpentAmount.ShouldBe(0m);
    }

    [Fact]
    public async Task Gorev_tasininca_finans_kayitlari_projeyi_izler()
    {
        var s = await SeedAsync("SCP-B");
        await _expenseAppService.CreateAsync(ExpenseInput(s, taskId: s.Task, projectId: null));

        await _taskAppService.TransferAsync(s.Task, new Dtos.TransferTaskDto
        {
            TargetProjectIds = new List<Guid> { s.P2 },
            Mode = TaskTransferMode.Move,
            Include = new Dtos.TransferTaskIncludeDto()
        });

        (await _budgetAppService.GetOverviewAsync(s.P1)).SpentAmount.ShouldBe(0m, "harcama eski projede kalmamalı");
        (await _budgetAppService.GetOverviewAsync(s.P2)).SpentAmount.ShouldBe(100m, "harcama görevle birlikte taşınmalı");
    }

    [Fact]
    public async Task SetScope_bagimsiza_alinca_hicbir_butceye_sayilmaz_ve_kalem_bagi_duser()
    {
        var s = await SeedAsync("SCP-C");
        var dto = await _expenseAppService.CreateAsync(ExpenseInput(s, taskId: s.Task, projectId: null));

        var updated = await _expenseAppService.SetScopeAsync(dto.Id, new SetExpenseScopeDto());

        updated.TaskId.ShouldBeNull();
        updated.ProjectId.ShouldBeNull();
        updated.BudgetLineId.ShouldBeNull();
        (await _budgetAppService.GetOverviewAsync(s.P1)).SpentAmount.ShouldBe(0m,
            "bağımsız harcama Genel gider havuzudur, proje bütçesine sayılmaz");
    }

    [Fact]
    public async Task SetScope_baska_goreve_baglayinca_proje_de_birlikte_degisir()
    {
        var s = await SeedAsync("SCP-D");
        var digerGorev = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
                new TaskItem(digerGorev, "P2 görevi", projectId: s.P2, startDate: DateTime.Today), autoSave: true);
            await uow.CompleteAsync();
        }
        var dto = await _expenseAppService.CreateAsync(ExpenseInput(s, taskId: s.Task, projectId: null));

        var updated = await _expenseAppService.SetScopeAsync(dto.Id,
            new SetExpenseScopeDto { TaskId = digerGorev, ProjectId = s.P1 /* yok sayılmalı */ });

        updated.TaskId.ShouldBe(digerGorev);
        updated.ProjectId.ShouldBe(s.P2, "proje hedef görevden türetilir, girdideki değer bağlayıcı değildir");
    }

    [Fact]
    public async Task Proje_seviyesi_kontrol_maddesi_eklenir_toplanir_ve_islenebilir()
    {
        var s = await SeedAsync("SCP-E");
        await _taskAppService.AddChecklistItemAsync(s.Task, "Görev maddesi");
        var projeMaddeId = await _taskAppService.AddProjectChecklistItemAsync(s.P1, "Proje maddesi");

        var items = await _taskAppService.GetProjectChecklistAsync(s.P1);
        items.Count.ShouldBe(2);
        items.ShouldContain(i => i.Text == "Proje maddesi" && i.TaskId == null);
        items.ShouldContain(i => i.Text == "Görev maddesi" && i.TaskId == s.Task);

        // Üst kapsamdan tam düzenleme: proje maddesi işaretlenebilmeli.
        await _taskAppService.ToggleChecklistItemAsync(projeMaddeId);
        (await _taskAppService.GetProjectChecklistAsync(s.P1))
            .ShouldContain(i => i.Id == projeMaddeId && i.IsDone);

        // Proje maddesi görev listesine SIZMAZ.
        (await _taskAppService.GetChecklistItemsAsync(s.Task))
            .ShouldAllBe(i => i.TaskId == s.Task);
    }
}
