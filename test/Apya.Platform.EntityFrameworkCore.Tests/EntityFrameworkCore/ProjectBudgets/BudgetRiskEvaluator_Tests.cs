using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// SÖZLEŞME: bütçe riski kullanıcı ekranı açmadan ölçülür ve durum başına BİR KEZ
/// duyurulur.
///
/// <para><c>UsagePercent</c> ve <c>IsOverBudget</c> zaten hesaplanıyordu — ama yalnız
/// okuma anında. Kimse ekranı açmazsa kimse öğrenmiyordu. Bu testler ölçümün
/// gerçekten yapıldığını ve worker'ın her turunda tekrar etmediğini doğrular.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class BudgetRiskEvaluator_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string UserProvider = "U";

    private readonly BudgetRiskEvaluator _evaluator;
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IPermissionManager _permissionManager;
    private readonly ICurrentTenant _currentTenant;

    public BudgetRiskEvaluator_Tests()
    {
        _evaluator              = GetRequiredService<BudgetRiskEvaluator>();
        _budgetAppService       = GetRequiredService<IProjectBudgetAppService>();
        _projectRepository      = GetRequiredService<IRepository<Project, Guid>>();
        _memberRepository       = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _expenseRepository      = GetRequiredService<IRepository<Expense, Guid>>();
        _cashAccountRepository  = GetRequiredService<IRepository<CashAccount, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _permissionManager      = GetRequiredService<IPermissionManager>();
        _currentTenant          = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Guid ProjectId, Guid LeadUserId)> NewProjectWithLeadAsync()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Risk " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-RSK", "", 1_000_000m, 0m, "TRY");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var leadUserId = Guid.NewGuid();
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, leadUserId, ProjectMemberRole.Lead, _currentTenant.Id),
            autoSave: true);

        await _permissionManager.SetAsync(
            PlatformPermissions.Projects.ViewBudget, UserProvider, leadUserId.ToString(), isGranted: true);

        return (project.Id, leadUserId);
    }

    private Task<ProjectBudgetLineDto> NewLineAsync(Guid projectId, decimal approved)
        => _budgetAppService.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Personel", PlannedAmount = approved, ApprovedAmount = approved
        });

    private async Task SpendAsync(Guid projectId, Guid lineId, decimal amount)
    {
        var account = new CashAccount(Guid.NewGuid(), "Test Kasası", tenantId: _currentTenant.Id);
        await _cashAccountRepository.InsertAsync(account, autoSave: true);

        var expense = new Expense(
            Guid.NewGuid(), "Gider " + amount, amount, account.Id, DateTime.Today,
            projectId: projectId, tenantId: _currentTenant.Id);
        expense.BudgetLineId = lineId;

        await _expenseRepository.InsertAsync(expense, autoSave: true);
    }

    private async Task<List<Notification>> NotificationsOfAsync(Guid userId)
        => await _notificationRepository.GetListAsync(n => n.UserId == userId);

    [Fact]
    public async Task Crossing_A_Threshold_Should_Warn_Once_With_The_Highest_Mark()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();
        var line = await NewLineAsync(projectId, 100_000m);

        await SpendAsync(projectId, line.Id, 80_000m);   // %80 → 50, 75 uygun; en yüksek 75

        await WithUnitOfWorkAsync(() => _evaluator.EvaluateProjectAsync(projectId));
        await WithUnitOfWorkAsync(() => _evaluator.EvaluateProjectAsync(projectId)); // ikinci tur tekrar üretmemeli

        var notification = (await NotificationsOfAsync(leadUserId)).ShouldHaveSingleItem();

        notification.Type.ShouldBe(NotificationType.BudgetUsageThresholdReached);
        notification.Severity.ShouldBe(NotificationSeverity.High);
        notification.Title.ShouldContain("75");           // eşik başlıkta
        notification.Body.ShouldContain("80");            // gerçekleşen yüzde gövdede
        notification.Body.ShouldContain("Personel");
        notification.Body.ShouldContain("20.000,00 TRY"); // kalan tutar
    }

    [Fact]
    public async Task Exceeding_The_Budget_Should_Raise_A_Critical_Overrun()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();
        var line = await NewLineAsync(projectId, 100_000m);

        await SpendAsync(projectId, line.Id, 112_000m);   // %112

        await WithUnitOfWorkAsync(() => _evaluator.EvaluateProjectAsync(projectId));

        var notifications = await NotificationsOfAsync(leadUserId);

        // Aşımda %100 eşiği SUSAR: aynı olay iki satırda okunmamalı.
        var overrun = notifications.ShouldHaveSingleItem();
        overrun.Type.ShouldBe(NotificationType.BudgetOverrun);
        overrun.Severity.ShouldBe(NotificationSeverity.Critical);
        overrun.Body.ShouldContain("12.000,00 TRY");      // plan dışı tutar
    }

    [Fact]
    public async Task Reaching_Exactly_The_Budget_Should_Fire_The_Hundred_Mark_Not_An_Overrun()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();
        var line = await NewLineAsync(projectId, 100_000m);

        await SpendAsync(projectId, line.Id, 100_000m);   // tam %100, aşım YOK

        await WithUnitOfWorkAsync(() => _evaluator.EvaluateProjectAsync(projectId));

        var notification = (await NotificationsOfAsync(leadUserId)).ShouldHaveSingleItem();

        notification.Type.ShouldBe(NotificationType.BudgetUsageThresholdReached);
        notification.Title.ShouldContain("100");
    }

    [Fact]
    public async Task Revising_The_Budget_Should_Re_Arm_The_Warnings()
    {
        // Tekillik anahtarında onaylanan tutar var: revizyon sonrası yeni bütçeye
        // göre yeniden aşım yaşanırsa kullanıcı bunu duymalı.
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();
        var line = await NewLineAsync(projectId, 100_000m);

        await SpendAsync(projectId, line.Id, 112_000m);
        await WithUnitOfWorkAsync(() => _evaluator.EvaluateProjectAsync(projectId));

        // Bütçe 90.000'e düşürüldü — aşım büyüdü, uyarı yenilenmeli.
        await _budgetAppService.ApplyRevisionAsync(projectId, new ApplyBudgetRevisionDto
        {
            Reason  = "Donör kesintisi",
            Changes = new Dictionary<Guid, decimal> { [line.Id] = 90_000m }
        });

        await WithUnitOfWorkAsync(() => _evaluator.EvaluateProjectAsync(projectId));

        var overruns = (await NotificationsOfAsync(leadUserId))
            .Where(n => n.Type == NotificationType.BudgetOverrun)
            .ToList();

        overruns.Count.ShouldBe(2);
        overruns.Select(n => n.GroupKey).Distinct().Count().ShouldBe(2); // anahtarlar farklı
    }

    [Fact]
    public async Task An_Overdue_Tranche_Should_Be_Reported_By_The_Daily_Scan()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();

        var tranche = await _budgetAppService.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto
        {
            Title = "1. Dilim",
            PlannedAmount = 250_000m,
            PlannedDate = DateTime.Today.AddDays(-10)     // vadesi geçti, tahsil edilmedi
        });

        await WithUnitOfWorkAsync(() => _evaluator.RunDailyScanAsync());
        await WithUnitOfWorkAsync(() => _evaluator.RunDailyScanAsync());             // ertesi gün tekrar etmemeli

        var notification = (await NotificationsOfAsync(leadUserId))
            .ShouldHaveSingleItem();

        notification.Type.ShouldBe(NotificationType.FundingTrancheOverdue);
        notification.Body.ShouldContain("10");            // kaç gündür geciktiği
        notification.Body.ShouldContain("250.000,00 TRY");
        notification.EntityId.ShouldBe(projectId);
        tranche.Status.ShouldBe(FundingTrancheStatus.Pending);
    }

    [Fact]
    public async Task A_Collected_Tranche_Should_Never_Be_Reported_As_Overdue()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();

        var tranche = await _budgetAppService.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto
        {
            PlannedAmount = 100_000m,
            PlannedDate = DateTime.Today.AddDays(-5)
        });

        await _budgetAppService.RegisterCollectionAsync(tranche.Id, new RegisterCollectionDto
        {
            ReceivedAmount = 100_000m, ReceivedDate = DateTime.Today
        });

        await WithUnitOfWorkAsync(() => _evaluator.RunDailyScanAsync());

        (await NotificationsOfAsync(leadUserId))
            .ShouldNotContain(n => n.Type == NotificationType.FundingTrancheOverdue);
    }
}
