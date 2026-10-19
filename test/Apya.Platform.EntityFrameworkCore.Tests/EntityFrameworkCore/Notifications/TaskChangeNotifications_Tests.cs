using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// N-03 · Görevin muhatabına giden değişiklikler hangi ekrandan yapılırsa yapılsın bildirilir: durum
/// (eskiden yalnız durum ucundan), atamanın alınması (eski sorumluya), son tarih ve Kritik öncelik
/// (sorumluya), yoruma yanıt (yanıtlanana). Olayı yapan kendine bildirim almaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskChangeNotifications_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRepository<Notification, Guid> _notifications;
    private readonly IRepository<TaskItem, Guid> _tasks;

    public TaskChangeNotifications_Tests()
    {
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
        _tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
    }

    private async Task<Guid> UserAsync(string? name = null, string? surname = null)
    {
        var id = Guid.NewGuid();
        var suffix = id.ToString("N")[..8];
        await WithUnitOfWorkAsync(() => GetRequiredService<IIdentityUserRepository>().InsertAsync(
            new IdentityUser(id, "kisi-" + suffix, $"kisi-{suffix}@apya.test") { Name = name, Surname = surname }, autoSave: true));
        return id;
    }

    private async Task<Guid> NewTaskAsync(Guid assigneeId)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(() => _tasks.InsertAsync(new TaskItem(id, "Değişen görev",
            assigneeId: assigneeId, dueDate: DateTime.Today.AddDays(5), now: DateTime.Today), autoSave: true));
        return id;
    }

    private Task<List<NotificationType>> TypesAsync(Guid userId, Guid taskId)
        => WithUnitOfWorkAsync(async () => (await _notifications.GetListAsync(n => n.UserId == userId && n.EntityId == taskId))
            .Select(n => n.Type).ToList());

    [Fact]
    public async Task Durum_son_tarih_ve_kritik_oncelik_sorumluya_bildirilir()
    {
        var assignee = await UserAsync();
        var taskId = await NewTaskAsync(assignee);
        var manager = GetRequiredService<TaskManager>();

        await WithUnitOfWorkAsync(async () =>
        {
            var task = await _tasks.GetAsync(taskId);
            var before = TaskChangeSnapshot.Of(task);
            task.ChangeStatus(Apya.Platform.Tasks.TaskStatus.InProgress, DateTime.Now);
            task.UpdateSchedule(task.StartDate, DateTime.Today.AddDays(9));
            task.ChangePriority(TaskPriority.Critical);
            await _tasks.UpdateAsync(task, autoSave: true);
            await manager.PublishChangesAsync(task, before, Guid.NewGuid(), "Elif Şahin");
        });

        var types = await TypesAsync(assignee, taskId);
        types.ShouldContain(NotificationType.TaskStatusChanged);
        types.ShouldContain(NotificationType.TaskDueDateChanged);
        types.ShouldContain(NotificationType.TaskPriorityRaised);
    }

    [Fact]
    public async Task Atama_alininca_eski_sorumlu_haberdar_olur_kendi_degisikligi_bildirilmez()
    {
        var oldAssignee = await UserAsync();
        var newAssignee = await UserAsync();
        var taskId = await NewTaskAsync(oldAssignee);
        var manager = GetRequiredService<TaskManager>();

        await WithUnitOfWorkAsync(async () =>
        {
            var task = await _tasks.GetAsync(taskId);
            var before = TaskChangeSnapshot.Of(task);
            task.AssignTo(newAssignee);
            await _tasks.UpdateAsync(task, autoSave: true);
            await manager.PublishChangesAsync(task, before, Guid.NewGuid(), "Elif Şahin");
        });
        (await TypesAsync(oldAssignee, taskId)).ShouldContain(NotificationType.TaskUnassigned);

        // Sorumlu kendi görevinin tarihini değiştirirse kendine bildirim gitmez.
        var self = await UserAsync();
        var ownTaskId = await NewTaskAsync(self);
        await WithUnitOfWorkAsync(async () =>
        {
            var task = await _tasks.GetAsync(ownTaskId);
            var before = TaskChangeSnapshot.Of(task);
            task.UpdateSchedule(task.StartDate, DateTime.Today.AddDays(20));
            await _tasks.UpdateAsync(task, autoSave: true);
            await manager.PublishChangesAsync(task, before, self, "Kendisi");
        });
        (await TypesAsync(self, ownTaskId)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Yoruma_yanit_yanitlanana_tek_bildirim_olarak_gider()
    {
        var author = await UserAsync();
        var replier = await UserAsync("Can", "Öztürk");
        var taskId = await NewTaskAsync(author); // yazar aynı zamanda sorumlu: yine TEK bildirim

        Guid commentId;
        using (Principal(author, "yazar"))
        {
            commentId = await WithUnitOfWorkAsync(() => GetRequiredService<ITaskAppService>().AddCommentAsync(taskId, "Teklifler hazır mı?"));
        }
        using (Principal(replier, "yanitlayan", "Can", "Öztürk"))
        {
            await WithUnitOfWorkAsync(() => GetRequiredService<ITaskAppService>().ReplyToCommentAsync(commentId, "Yarın hazır."));
        }

        var types = await TypesAsync(author, taskId);
        types.Count(t => t == NotificationType.CommentReplied).ShouldBe(1);
        types.ShouldNotContain(NotificationType.TaskCommentAdded);
    }

    private IDisposable Principal(Guid id, string userName, string? name = null, string? surname = null)
    {
        var claims = new List<Claim>
        {
            new(AbpClaimTypes.UserId, id.ToString()),
            new(AbpClaimTypes.UserName, userName)
        };
        if (name != null) { claims.Add(new Claim(AbpClaimTypes.Name, name)); }
        if (surname != null) { claims.Add(new Claim(AbpClaimTypes.SurName, surname)); }
        return GetRequiredService<ICurrentPrincipalAccessor>().Change(new ClaimsPrincipal(new ClaimsIdentity(claims, "Test")));
    }
}
