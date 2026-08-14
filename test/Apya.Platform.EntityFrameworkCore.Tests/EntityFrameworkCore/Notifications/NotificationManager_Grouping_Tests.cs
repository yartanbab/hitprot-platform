using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// Gruplama sözleşmesi: aynı kayda ait tekrarlayan bildirimler tek satırda toplanır.
/// <para>
/// Bir göreve gelen her yorum ayrı satır açtığında bildirim listesi hızla okunamaz
/// hale geliyordu. Her <c>PublishAsync</c> ayrı bir iş biriminde çalıştırılıyor —
/// üretimde de her olay ayrı bir istekten gelir.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class NotificationManager_Grouping_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly NotificationManager _manager;
    private readonly IRepository<Notification, Guid> _repository;

    public NotificationManager_Grouping_Tests()
    {
        _manager    = GetRequiredService<NotificationManager>();
        _repository = GetRequiredService<IRepository<Notification, Guid>>();
    }

    private Task PublishAsync(Guid userId, NotificationType type, Guid entityId, string body)
        => WithUnitOfWorkAsync(() => _manager.PublishAsync(
            userId, "başlık", body, type, entityType: "Task", entityId: entityId));

    [Fact]
    public async Task Repeated_Comments_On_The_Same_Task_Should_Fold_Into_One_Row()
    {
        var userId = Guid.NewGuid();
        var taskId = Guid.NewGuid();

        await PublishAsync(userId, NotificationType.TaskCommentAdded, taskId, "ilk");
        await PublishAsync(userId, NotificationType.TaskCommentAdded, taskId, "ikinci");
        await PublishAsync(userId, NotificationType.TaskCommentAdded, taskId, "üçüncü");

        var rows = await _repository.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(1);
        rows[0].OccurrenceCount.ShouldBe(3);
        rows[0].Body.ShouldBe("üçüncü");           // metin son olaya göre tazelenir
        rows[0].GroupKey.ShouldBe($"2:Task:{taskId}");
    }

    [Fact]
    public async Task Comments_On_Different_Tasks_Should_Stay_Separate()
    {
        var userId = Guid.NewGuid();

        await PublishAsync(userId, NotificationType.TaskCommentAdded, Guid.NewGuid(), "a");
        await PublishAsync(userId, NotificationType.TaskCommentAdded, Guid.NewGuid(), "b");

        var rows = await _repository.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(2);
        rows.ShouldAllBe(r => r.OccurrenceCount == 1);
    }

    [Fact]
    public async Task Non_Repeatable_Types_Should_Never_Fold()
    {
        // Atama tekil bir olaydır; iki kez atanmak iki ayrı bildirimdir.
        var userId = Guid.NewGuid();
        var taskId = Guid.NewGuid();

        await PublishAsync(userId, NotificationType.TaskAssigned, taskId, "ilk");
        await PublishAsync(userId, NotificationType.TaskAssigned, taskId, "ikinci");

        var rows = await _repository.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(2);
        rows.ShouldAllBe(r => r.GroupKey == null);
    }

    [Fact]
    public async Task Reading_A_Grouped_Row_Should_Start_A_Fresh_One()
    {
        // Kullanıcı bildirimi okuduktan sonra gelen yorum yeni satır açmalı —
        // aksi halde okunmuş satır sessizce okunmamışa dönerdi.
        var userId = Guid.NewGuid();
        var taskId = Guid.NewGuid();

        await PublishAsync(userId, NotificationType.TaskCommentAdded, taskId, "ilk");

        await WithUnitOfWorkAsync(async () =>
        {
            var row = (await _repository.GetListAsync(n => n.UserId == userId)).Single();
            row.MarkAsRead();
            await _repository.UpdateAsync(row);
        });

        await PublishAsync(userId, NotificationType.TaskCommentAdded, taskId, "ikinci");

        var rows = await _repository.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(2);
        rows.Count(r => r.IsRead).ShouldBe(1);
        rows.Single(r => !r.IsRead).Body.ShouldBe("ikinci");
    }

    [Fact]
    public async Task Grouping_Should_Not_Leak_Across_Users()
    {
        var taskId = Guid.NewGuid();
        var firstUser  = Guid.NewGuid();
        var secondUser = Guid.NewGuid();

        await PublishAsync(firstUser,  NotificationType.TaskCommentAdded, taskId, "a");
        await PublishAsync(secondUser, NotificationType.TaskCommentAdded, taskId, "b");

        (await _repository.GetListAsync(n => n.UserId == firstUser)).Single()
            .OccurrenceCount.ShouldBe(1);
        (await _repository.GetListAsync(n => n.UserId == secondUser)).Single()
            .OccurrenceCount.ShouldBe(1);
    }

    [Fact]
    public async Task Category_And_Severity_Should_Be_Persisted_From_The_Registry()
    {
        var userId = Guid.NewGuid();

        await PublishAsync(userId, NotificationType.TaskDueSoon, Guid.NewGuid(), "vade");

        var row = (await _repository.GetListAsync(n => n.UserId == userId)).Single();

        row.Category.ShouldBe(NotificationCategory.Tasks);
        row.Severity.ShouldBe(NotificationSeverity.Critical);
        row.LastOccurredAt.ShouldNotBe(default);
    }
}
