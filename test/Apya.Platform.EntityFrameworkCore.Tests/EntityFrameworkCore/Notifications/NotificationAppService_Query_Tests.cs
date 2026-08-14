using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// Bildirim merkezinin sorgu sözleşmesi: kategori/aciliyet filtreleri, iki sıralama
/// kipi ve kategori sayaçları. Testler oturumdaki kullanıcıya yazar — servis her
/// zaman yalnızca kendi kayıtlarını döndürmeli.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class NotificationAppService_Query_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly INotificationAppService _appService;
    private readonly IRepository<Notification, Guid> _repository;
    private readonly ICurrentUser _currentUser;

    public NotificationAppService_Query_Tests()
    {
        _appService  = GetRequiredService<INotificationAppService>();
        _repository  = GetRequiredService<IRepository<Notification, Guid>>();
        _currentUser = GetRequiredService<ICurrentUser>();
    }

    private async Task SeedAsync(NotificationType type, string body, bool isRead = false)
    {
        var notification = new Notification(
            Guid.NewGuid(), tenantId: null, userId: _currentUser.GetId(),
            type, "başlık", body, entityType: "Task", entityId: Guid.NewGuid());

        if (isRead)
            notification.MarkAsRead();

        await _repository.InsertAsync(notification, autoSave: true);
    }

    [Fact]
    public async Task Category_Filter_Should_Narrow_The_List()
    {
        await SeedAsync(NotificationType.TaskAssigned, "görev");
        await SeedAsync(NotificationType.DocumentExpiring, "belge");
        await SeedAsync(NotificationType.GrantRecommended, "hibe");

        var result = await _appService.GetMyNotificationsAsync(
            new GetNotificationsInput { Category = NotificationCategory.Documents });

        result.Items.Count.ShouldBe(1);
        result.Items[0].Body.ShouldBe("belge");
        result.Items[0].Category.ShouldBe(NotificationCategory.Documents);
    }

    [Fact]
    public async Task MinSeverity_Should_Include_Everything_Above_The_Threshold()
    {
        await SeedAsync(NotificationType.TaskDueSoon, "kritik");        // Critical
        await SeedAsync(NotificationType.TaskAssigned, "yüksek");       // High
        await SeedAsync(NotificationType.TaskCommentAdded, "normal");   // Normal
        await SeedAsync(NotificationType.AiWorkflowTriggered, "bilgi"); // Info

        var result = await _appService.GetMyNotificationsAsync(
            new GetNotificationsInput { MinSeverity = NotificationSeverity.High });

        result.Items.Count.ShouldBe(2);
        result.Items.ShouldAllBe(i => i.Severity >= NotificationSeverity.High);
    }

    [Fact]
    public async Task Importance_Sort_Should_Put_Critical_First()
    {
        await SeedAsync(NotificationType.TaskCommentAdded, "normal");
        await SeedAsync(NotificationType.TaskDueSoon, "kritik");
        await SeedAsync(NotificationType.AiWorkflowTriggered, "bilgi");

        var byImportance = await _appService.GetMyNotificationsAsync(
            new GetNotificationsInput { Sort = NotificationSortMode.Importance });

        byImportance.Items.First().Body.ShouldBe("kritik");
        byImportance.Items.Last().Body.ShouldBe("bilgi");

        // Varsayılan kip zaman sıralı: en son eklenen üstte
        var byRecent = await _appService.GetMyNotificationsAsync(new GetNotificationsInput());
        byRecent.Items.First().Body.ShouldBe("bilgi");
    }

    [Fact]
    public async Task Text_Filter_Should_Match_Title_Or_Body()
    {
        await SeedAsync(NotificationType.TaskAssigned, "sözleşme taslağı");
        await SeedAsync(NotificationType.TaskAssigned, "toplantı notu");

        var result = await _appService.GetMyNotificationsAsync(
            new GetNotificationsInput { Filter = "sözleşme" });

        result.Items.Count.ShouldBe(1);
        result.Items[0].Body.ShouldBe("sözleşme taslağı");
    }

    [Fact]
    public async Task Summary_Should_Count_Unread_Per_Category_And_Importance()
    {
        await SeedAsync(NotificationType.TaskAssigned, "a");            // Tasks / High
        await SeedAsync(NotificationType.TaskDueSoon, "b");             // Tasks / Critical
        await SeedAsync(NotificationType.DocumentExpiring, "c");        // Documents / High
        await SeedAsync(NotificationType.AiWorkflowTriggered, "d");     // Ai / Info
        await SeedAsync(NotificationType.GrantRecommended, "e", isRead: true); // okunmuş → sayılmaz

        var summary = await _appService.GetSummaryAsync();

        summary.TotalUnread.ShouldBe(4);
        summary.ImportantUnread.ShouldBe(3);
        summary.Categories.Single(c => c.Category == NotificationCategory.Tasks).UnreadCount.ShouldBe(2);
        summary.Categories.Single(c => c.Category == NotificationCategory.Documents).UnreadCount.ShouldBe(1);
        summary.Categories.ShouldNotContain(c => c.Category == NotificationCategory.Grants);
    }

    [Fact]
    public async Task MarkCategoryAsRead_Should_Leave_Other_Categories_Untouched()
    {
        await SeedAsync(NotificationType.TaskAssigned, "görev");
        await SeedAsync(NotificationType.DocumentExpiring, "belge");

        await _appService.MarkCategoryAsReadAsync(NotificationCategory.Tasks);

        var summary = await _appService.GetSummaryAsync();

        summary.TotalUnread.ShouldBe(1);
        summary.Categories.Single().Category.ShouldBe(NotificationCategory.Documents);
    }

    [Fact]
    public async Task DeleteRead_Should_Remove_Only_Read_Rows()
    {
        await SeedAsync(NotificationType.TaskAssigned, "okunmamış");
        await SeedAsync(NotificationType.TaskAssigned, "okunmuş", isRead: true);

        var deleted = await _appService.DeleteReadAsync();

        deleted.ShouldBe(1);

        var remaining = await _appService.GetMyNotificationsAsync(new GetNotificationsInput());
        remaining.Items.Count.ShouldBe(1);
        remaining.Items[0].Body.ShouldBe("okunmamış");
    }

    [Fact]
    public async Task Dto_Should_Carry_Icon_And_DeepLink_From_The_Registry()
    {
        await SeedAsync(NotificationType.TaskAssigned, "görev");

        var result = await _appService.GetMyNotificationsAsync(new GetNotificationsInput());
        var dto = result.Items.Single();

        dto.Icon.ShouldNotBeNullOrWhiteSpace();
        dto.DeepLinkUrl.ShouldBe($"/Tasks/Detail/{dto.EntityId}");
        dto.OccurrenceCount.ShouldBe(1);
    }
}
