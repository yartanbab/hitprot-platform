using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// SÖZLEŞME: bütçe rakamı TEK yerden hesaplanır.
///
/// <para>Önceden iki hesap vardı: Finans çatısı <c>GetOverviewAsync</c>'i kullanıyordu
/// (kalem toplamı + revizyon + dilim tahsilatı), "Bütçe Durumu" modalı / proje
/// şeridindeki bütçe çubuğu / Raporlar-Proje Bütçesi ise ayrı bir servisten
/// <c>Project.TotalBudget</c>'ı ve ham gelir kayıtlarını okuyordu. Kalem, revizyon ya
/// da dilim girildiği anda aynı proje iki ekranda İKİ FARKLI rakam gösteriyordu.</para>
///
/// <para>Bu testler o ayrımın geri gelmesini engeller: hepsi artık bu tek özetten
/// beslendiği için, özet doğru olduğu sürece ekranlar da birbiriyle tutarlıdır.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class BudgetOverviewSingleSource_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public BudgetOverviewSingleSource_Tests()
    {
        _budgetAppService = GetRequiredService<IProjectBudgetAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _expenseRepository = GetRequiredService<IRepository<Expense, Guid>>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Proje bütçesi 1.000.000 — eski hesabın her ekranda bastığı rakam.</summary>
    private async Task<Guid> NewProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Tek kaynak testi " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-TEST", "", 1_000_000m, 0m, "TRY");

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> NewCashAccountAsync()
    {
        var account = new CashAccount(Guid.NewGuid(), "Test Kasası", tenantId: _currentTenant.Id);
        await _cashAccountRepository.InsertAsync(account, autoSave: true);
        return account.Id;
    }

    private async Task<Guid> NewTaskAsync(Guid projectId)
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Bütçeli görev", projectId,
            tenantId: _currentTenant.Id, now: new DateTime(2026, 8, 1));

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    [Fact]
    public async Task Kalem_ve_revizyon_varken_butce_TotalBudget_degil_onaylanan_tutardir()
    {
        var projectId = await NewProjectAsync();

        var line = await _budgetAppService.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Personel", PlannedAmount = 500_000m,
        });

        await _budgetAppService.ApplyRevisionAsync(projectId, new ApplyBudgetRevisionDto
        {
            Reason = "Kesinti sonrası",
            EffectiveDate = new DateTime(2026, 8, 15),
            Changes = { [line.Id] = 400_000m },
        });

        var overview = await _budgetAppService.GetOverviewAsync(projectId);

        // Sözleşme tutarı revizyondan etkilenmez, yürürlükteki tutar değişir.
        overview.ContractBudget.ShouldBe(500_000m);
        overview.ApprovedBudget.ShouldBe(400_000m);
        overview.LatestRevisionNo.ShouldBe(1);

        // Eski hesap burada 1.000.000 derdi; hiçbir ekran artık öyle demiyor.
        overview.ApprovedBudget.ShouldNotBe(1_000_000m);
        overview.RemainingBudget.ShouldBe(400_000m);
    }

    [Fact]
    public async Task Dilim_varken_gelen_para_tahsilattan_gelir_ve_nakit_ondan_hesaplanir()
    {
        var projectId = await NewProjectAsync();

        await _budgetAppService.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Personel", PlannedAmount = 500_000m,
        });

        var tranche = await _budgetAppService.CreateTrancheAsync(projectId,
            new CreateUpdateTrancheDto { PlannedAmount = 300_000m, Title = "1. Dilim" });

        await _budgetAppService.RegisterCollectionAsync(tranche.Id,
            new RegisterCollectionDto { ReceivedAmount = 250_000m, ReceivedDate = new DateTime(2026, 8, 20) });

        await InsertExpenseAsync(projectId, 100_000m, taskId: null);

        var overview = await _budgetAppService.GetOverviewAsync(projectId);

        overview.TrancheCount.ShouldBe(1);
        overview.MoneyIn.ShouldBe(250_000m);          // gelir kaydı yok; para dilimden geldi
        overview.SpentAmount.ShouldBe(100_000m);
        overview.AvailableCash.ShouldBe(150_000m);    // gelen − harcanan
        overview.RemainingBudget.ShouldBe(400_000m);  // onaylanan − harcanan
        overview.BudgetUsagePercent.ShouldBe(20);     // 100.000 / 500.000
    }

    /// <summary>
    /// Görev kırılımı da bu özetin parçası: modalın ve raporun ayrı bir servise
    /// gitmesine gerek kalmadı.
    /// </summary>
    [Fact]
    public async Task Ozet_gorev_bazli_kirilimi_da_dondurur()
    {
        var projectId = await NewProjectAsync();
        var taskId = await NewTaskAsync(projectId);

        await InsertExpenseAsync(projectId, 30_000m, taskId);
        await InsertExpenseAsync(projectId, 20_000m, taskId: null);

        var overview = await _budgetAppService.GetOverviewAsync(projectId);

        overview.SpentAmount.ShouldBe(50_000m);
        overview.TaskBreakdown.Count.ShouldBe(2);
        overview.TaskBreakdown.Single(x => x.TaskId == taskId).Expense.ShouldBe(30_000m);
        overview.TaskBreakdown.Single(x => x.TaskId == null).Expense.ShouldBe(20_000m);
    }

    private async Task InsertExpenseAsync(Guid projectId, decimal amount, Guid? taskId)
    {
        await _expenseRepository.InsertAsync(
            new Expense(
                Guid.NewGuid(),
                "Gider " + amount,
                amount,
                await NewCashAccountAsync(),
                new DateTime(2026, 8, 10),
                projectId: projectId,
                taskId: taskId,
                tenantId: _currentTenant.Id),
            autoSave: true);
    }
}
