using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
/// SÖZLEŞME: bütçe hareketleri artık sessiz değil.
///
/// <para>Revizyon, tahsilat, kesinti ve itiraz bugüne kadar hiçbir bildirim
/// üretmiyordu — proje sorumlusu ekranı açmadıkça bütçesinin değiştiğini
/// öğrenemiyordu. Bu testler kancaların yerinde durduğunu ve doğru türü
/// yazdığını doğrular.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceNotificationHooks_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string UserProvider = "U";

    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IPermissionManager _permissionManager;
    private readonly ICurrentTenant _currentTenant;

    public FinanceNotificationHooks_Tests()
    {
        _budgetAppService       = GetRequiredService<IProjectBudgetAppService>();
        _projectRepository      = GetRequiredService<IRepository<Project, Guid>>();
        _memberRepository       = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _permissionManager      = GetRequiredService<IPermissionManager>();
        _currentTenant          = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Bütçesi olan bir proje ve bildirimi alacak yetkili bir sorumlu.</summary>
    private async Task<(Guid ProjectId, Guid LeadUserId)> NewProjectWithLeadAsync()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Bildirim kancası " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-NTF", "", 500_000m, 0m, "TRY");

        await _projectRepository.InsertAsync(project, autoSave: true);

        var leadUserId = Guid.NewGuid();
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, leadUserId, ProjectMemberRole.Lead, _currentTenant.Id),
            autoSave: true);

        await _permissionManager.SetAsync(
            PlatformPermissions.Projects.ViewBudget, UserProvider, leadUserId.ToString(), isGranted: true);

        return (project.Id, leadUserId);
    }

    private async Task<List<Notification>> NotificationsOfAsync(Guid userId)
        => await _notificationRepository.GetListAsync(n => n.UserId == userId);

    private Task<FundingTrancheDto> NewTrancheAsync(Guid projectId, decimal plannedAmount = 100_000m)
        => _budgetAppService.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto
        {
            Title = "1. Dilim",
            PlannedAmount = plannedAmount,
            PlannedDate = DateTime.Today.AddDays(30)
        });

    [Fact]
    public async Task Applying_A_Revision_Should_Notify_The_Lead()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();

        var line = await _budgetAppService.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Personel", PlannedAmount = 200_000m, ApprovedAmount = 200_000m
        });

        await _budgetAppService.ApplyRevisionAsync(projectId, new ApplyBudgetRevisionDto
        {
            Reason  = "Donör kesintisi",
            Changes = new Dictionary<Guid, decimal> { [line.Id] = 150_000m }
        });

        var notification = (await NotificationsOfAsync(leadUserId)).ShouldHaveSingleItem();

        notification.Type.ShouldBe(NotificationType.BudgetRevisionApplied);
        notification.Category.ShouldBe(NotificationCategory.Finance);
        notification.EntityType.ShouldBe("Project");
        notification.EntityId.ShouldBe(projectId);
        notification.Body.ShouldContain("Donör kesintisi");   // gerekçe gövdede
        notification.Body.ShouldContain("150.000,00 TRY");    // revizyon sonrası toplam
    }

    [Fact]
    public async Task Registering_A_Collection_Should_Notify_The_Lead()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();
        var tranche = await NewTrancheAsync(projectId);

        await _budgetAppService.RegisterCollectionAsync(tranche.Id, new RegisterCollectionDto
        {
            ReceivedAmount = 100_000m, ReceivedDate = DateTime.Today
        });

        var notification = (await NotificationsOfAsync(leadUserId)).ShouldHaveSingleItem();

        notification.Type.ShouldBe(NotificationType.FundingTrancheCollected);
        notification.Severity.ShouldBe(NotificationSeverity.Info);
        notification.Body.ShouldContain("100.000,00 TRY");
    }

    [Fact]
    public async Task Adding_A_Deduction_Should_Notify_The_Lead_With_Its_Reason()
    {
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();
        var tranche = await NewTrancheAsync(projectId);

        await _budgetAppService.AddDeductionAsync(tranche.Id, new CreateDeductionDto
        {
            Amount = 15_000m, Reason = "Uygunsuz harcama"
        });

        var notification = (await NotificationsOfAsync(leadUserId)).ShouldHaveSingleItem();

        notification.Type.ShouldBe(NotificationType.TrancheDeductionAdded);
        notification.Severity.ShouldBe(NotificationSeverity.High);
        notification.Body.ShouldContain("15.000,00 TRY");
        notification.Body.ShouldContain("Uygunsuz harcama");
    }

    [Fact]
    public async Task Disputing_Should_Notify_But_Clearing_The_Flag_Should_Not()
    {
        // İtirazın açılması haber; geri alınması değil.
        var (projectId, leadUserId) = await NewProjectWithLeadAsync();
        var tranche = await NewTrancheAsync(projectId);

        await _budgetAppService.SetDisputedAsync(tranche.Id, disputed: true);
        await _budgetAppService.SetDisputedAsync(tranche.Id, disputed: false);

        var notification = (await NotificationsOfAsync(leadUserId)).ShouldHaveSingleItem();

        notification.Type.ShouldBe(NotificationType.TrancheDisputed);
    }

    [Fact]
    public async Task A_Project_Without_Eligible_Recipients_Should_Stay_Silent()
    {
        // Yetkisiz ekip = bildirim yok; işlem yine de tamamlanır.
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Sessiz proje " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-SLT", "", 100_000m, 0m, "TRY");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var yetkisizLead = Guid.NewGuid();
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, yetkisizLead, ProjectMemberRole.Lead, _currentTenant.Id),
            autoSave: true);

        var tranche = await NewTrancheAsync(project.Id);
        var result  = await _budgetAppService.RegisterCollectionAsync(tranche.Id, new RegisterCollectionDto
        {
            ReceivedAmount = 100_000m
        });

        result.ReceivedAmount.ShouldBe(100_000m);            // işlem tamam
        (await NotificationsOfAsync(yetkisizLead)).ShouldBeEmpty();  // bildirim yok
    }
}
