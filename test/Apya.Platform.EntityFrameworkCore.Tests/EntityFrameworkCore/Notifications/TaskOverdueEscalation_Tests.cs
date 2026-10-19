using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// B-13 · 3 gün geciken görev proje sorumlularına (Lead) bir kez yükseltilir; daha kısa gecikme, gizli görev ve
/// zaten bildirim alan sorumlu için yükseltme yok.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskOverdueEscalation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private async Task<Guid> UserAsync()
    {
        var id = Guid.NewGuid();
        var suffix = id.ToString("N")[..8];
        await WithUnitOfWorkAsync(() => GetRequiredService<IIdentityUserRepository>().InsertAsync(
            new IdentityUser(id, "lider-" + suffix, $"lider-{suffix}@apya.test"), autoSave: true));
        return id;
    }

    private async Task<(Guid Project, Guid Lead, Guid Assignee)> ArrangeAsync()
    {
        var lead = await UserAsync();
        var assignee = await UserAsync();
        var projectId = Guid.NewGuid();
        var suffix = projectId.ToString("N")[..6];
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Saha Projesi " + suffix, "SP-" + suffix[..4], "açıklama"), autoSave: true);
            await GetRequiredService<IRepository<ProjectMember, Guid>>().InsertAsync(
                new ProjectMember(Guid.NewGuid(), projectId, lead, ProjectMemberRole.Lead), autoSave: true);
        });
        return (projectId, lead, assignee);
    }

    private async Task<Guid> TaskAsync(Guid projectId, Guid assignee, bool isPrivate = false)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
            new TaskItem(id, "Saha ölçümü", projectId: projectId, dueDate: DateTime.Today.AddDays(-4),
                assigneeId: assignee, isPrivate: isPrivate, now: DateTime.Today.AddDays(-10)), autoSave: true));
        return id;
    }

    private Task OverdueAsync(Guid taskId, Guid assignee, int days)
        => WithUnitOfWorkAsync(() => GetRequiredService<ILocalEventBus>().PublishAsync(new TaskOverdueEto
        {
            TaskId = taskId, TaskTitle = "Saha ölçümü", AssigneeId = assignee,
            DueDate = DateTime.Today.AddDays(-days), DaysOverdue = days
        }));

    private Task<int> EscalationsAsync(Guid userId, Guid taskId)
        => WithUnitOfWorkAsync(async () => (await GetRequiredService<IRepository<Notification, Guid>>()
            .GetListAsync(n => n.UserId == userId && n.EntityId == taskId && n.Type == NotificationType.TaskOverdueEscalated)).Count);

    [Fact]
    public async Task Uc_gun_geciken_gorev_proje_sorumlusuna_bir_kez_yukseltilir()
    {
        var (project, lead, assignee) = await ArrangeAsync();
        var taskId = await TaskAsync(project, assignee);

        await OverdueAsync(taskId, assignee, 3);
        await OverdueAsync(taskId, assignee, 3); // işçi saatte bir koşar

        (await EscalationsAsync(lead, taskId)).ShouldBe(1);
        (await EscalationsAsync(assignee, taskId)).ShouldBe(0, "sorumlu gecikmeyi zaten alıyor");
    }

    [Fact]
    public async Task Kisa_gecikme_ve_gizli_gorev_yukseltilmez()
    {
        var (project, lead, assignee) = await ArrangeAsync();
        var shortTask = await TaskAsync(project, assignee);
        var privateTask = await TaskAsync(project, assignee, isPrivate: true);

        await OverdueAsync(shortTask, assignee, 2);
        await OverdueAsync(privateTask, assignee, 5);

        (await EscalationsAsync(lead, shortTask)).ShouldBe(0);
        (await EscalationsAsync(lead, privateTask)).ShouldBe(0);
    }
}
