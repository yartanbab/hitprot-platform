using System;
using Apya.Platform.Notifications;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Notifications;

public class Notification_Tests
{
    private static Notification Build(
        NotificationType type = NotificationType.TaskCommentAdded,
        NotificationSeverity? severity = null)
        => new(
            Guid.NewGuid(), tenantId: null, userId: Guid.NewGuid(),
            type, "başlık", "gövde",
            entityType: "Task", entityId: Guid.NewGuid(),
            severity: severity);

    [Fact]
    public void Constructor_Should_Derive_Category_And_Severity_From_The_Registry()
    {
        var notification = Build(NotificationType.TaskDueSoon);

        notification.Category.ShouldBe(NotificationCategory.Tasks);
        notification.Severity.ShouldBe(NotificationSeverity.Critical);
    }

    [Fact]
    public void Constructor_Should_Let_The_Publisher_Override_Severity()
    {
        var notification = Build(NotificationType.TaskCommentAdded, NotificationSeverity.Critical);

        notification.Severity.ShouldBe(NotificationSeverity.Critical);
    }

    [Fact]
    public void New_Notification_Should_Count_As_One_Occurrence()
    {
        var notification = Build();

        notification.OccurrenceCount.ShouldBe(1);
        notification.LastOccurredAt.ShouldNotBe(default);
        notification.IsRead.ShouldBeFalse();
    }

    [Fact]
    public void Repeat_Should_Increment_The_Counter_And_Refresh_The_Text()
    {
        var notification = Build();
        var firstOccurredAt = notification.LastOccurredAt;

        notification.Repeat("yeni başlık", "yeni gövde", actorName: "Deniz");

        notification.OccurrenceCount.ShouldBe(2);
        notification.Title.ShouldBe("yeni başlık");
        notification.Body.ShouldBe("yeni gövde");
        notification.ActorName.ShouldBe("Deniz");
        notification.LastOccurredAt.ShouldBeGreaterThanOrEqualTo(firstOccurredAt);
    }

    [Fact]
    public void Repeat_Should_Not_Resurrect_A_Read_Notification()
    {
        // Gruplama yalnızca okunmamış kayıtlarda uygulanır; okunmuş bir bildirim
        // Repeat aldığında okunmamışa dönmemeli — aksi halde kullanıcı temizlediği
        // satırın geri gelmesiyle karşılaşır.
        var notification = Build();
        notification.MarkAsRead();

        notification.Repeat("yeni", "gövde");

        notification.IsRead.ShouldBeTrue();
    }
}
