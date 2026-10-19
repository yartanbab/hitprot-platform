using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// P-09 · "İzle" düğmesi takip kaydı açıyordu ama hiçbir bildirim izleyiciye gitmiyordu.
/// Artık izleyiciler yorum ve durum bildirimini alır; olayı yapan, gizli görevin izleyicisi ve
/// atanan/açan (ayrıca bildirilir) tekrar almaz. Atanan değişince eski sorumlu izleyici kalır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskWatcherNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly NotificationDomainEventHandler _handler;
    private readonly IRepository<Notification, Guid> _notifications;
    private readonly IRepository<TaskItem, Guid> _tasks;
    private readonly IRepository<TaskWatcher, Guid> _watchers;

    public TaskWatcherNotification_Tests()
    {
        _handler = GetRequiredService<NotificationDomainEventHandler>();
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
        _tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
        _watchers = GetRequiredService<IRepository<TaskWatcher, Guid>>();
    }

    private async Task<Guid> NewTaskAsync(bool isPrivate, params Guid[] watcherIds)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await _tasks.InsertAsync(new TaskItem(id, "İzlenen görev", isPrivate: isPrivate, now: DateTime.Now), autoSave: true);
            foreach (var w in watcherIds)
            {
                await _watchers.InsertAsync(new TaskWatcher(Guid.NewGuid(), id, w), autoSave: true);
            }
        });
        return id;
    }

    private Task<int> CountAsync(Guid userId, Guid taskId)
        => WithUnitOfWorkAsync(() => _notifications.CountAsync(n => n.UserId == userId && n.EntityId == taskId));

    [Fact]
    public async Task Yorum_izleyiciye_gider_yorumu_yazana_gitmez()
    {
        var watcher = Guid.NewGuid();
        var commenter = Guid.NewGuid();
        var taskId = await NewTaskAsync(false, watcher, commenter);

        await WithUnitOfWorkAsync(() => _handler.HandleEventAsync(new TaskCommentAddedEto
        {
            TaskId = taskId, TaskTitle = "İzlenen görev", CommentUserId = commenter,
            CommenterName = "Yorumcu", CommentText = "merhaba"
        }));

        (await CountAsync(watcher, taskId)).ShouldBe(1);
        (await CountAsync(commenter, taskId)).ShouldBe(0);
    }

    [Fact]
    public async Task Durum_degisimi_izleyiciye_gider_atanan_iki_kez_almaz()
    {
        var watcherAndAssignee = Guid.NewGuid();
        var watcher = Guid.NewGuid();
        var taskId = await NewTaskAsync(false, watcherAndAssignee, watcher);

        await WithUnitOfWorkAsync(() => _handler.HandleEventAsync(new TaskStatusChangedEto
        {
            TaskId = taskId, TaskTitle = "İzlenen görev", AssigneeId = watcherAndAssignee,
            NewStatus = Apya.Platform.Tasks.TaskStatus.Done, ModifierUserId = Guid.NewGuid(), ChangedByName = "Biri"
        }));

        (await CountAsync(watcher, taskId)).ShouldBe(1);
        (await CountAsync(watcherAndAssignee, taskId)).ShouldBe(1);
    }

    [Fact]
    public async Task Gizli_gorevin_izleyicisine_bildirim_gitmez()
    {
        var watcher = Guid.NewGuid();
        var taskId = await NewTaskAsync(true, watcher);

        await WithUnitOfWorkAsync(() => _handler.HandleEventAsync(new TaskCommentAddedEto
        {
            TaskId = taskId, TaskTitle = "İzlenen görev", CommentUserId = Guid.NewGuid(),
            CommenterName = "Yorumcu", CommentText = "gizli"
        }));

        (await CountAsync(watcher, taskId)).ShouldBe(0);
    }

    [Fact]
    public async Task Atanan_degisince_eski_sorumlu_izleyici_kalir_bir_kez()
    {
        var manager = GetRequiredService<TaskManager>();
        var oldAssignee = Guid.NewGuid();
        var taskId = await NewTaskAsync(false);

        await WithUnitOfWorkAsync(() => manager.KeepPreviousAssigneeWatchingAsync(taskId, oldAssignee, Guid.NewGuid()));
        await WithUnitOfWorkAsync(() => manager.KeepPreviousAssigneeWatchingAsync(taskId, oldAssignee, null));

        var rows = await WithUnitOfWorkAsync(() => _watchers.GetListAsync(w => w.TaskId == taskId));
        rows.Count(w => w.UserId == oldAssignee).ShouldBe(1);
    }

    [Fact]
    public async Task Atanan_ayni_kalirsa_izleyici_eklenmez()
    {
        var manager = GetRequiredService<TaskManager>();
        var assignee = Guid.NewGuid();
        var taskId = await NewTaskAsync(false);

        await WithUnitOfWorkAsync(() => manager.KeepPreviousAssigneeWatchingAsync(taskId, assignee, assignee));

        (await WithUnitOfWorkAsync(() => _watchers.CountAsync(w => w.TaskId == taskId))).ShouldBe(0);
    }
}
