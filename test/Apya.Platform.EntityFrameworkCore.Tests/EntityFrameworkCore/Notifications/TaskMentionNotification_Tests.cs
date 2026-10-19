using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// P-09 · Yorumda bahsedilen kişi "Sizden bahsedildi" alır; atanan olsa bile aynı yorum için
/// ikinci (genel yorum) bildirimi almaz. Var olmayan kimlik sessizce düşer.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskMentionNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Bahsedilen_atanan_tek_bildirim_alir_bilinmeyen_kimlik_duser()
    {
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var assigneeId = Guid.NewGuid();
        var unknownId = Guid.NewGuid();
        var taskId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(
                new IdentityUser(assigneeId, "bahsedilen-" + suffix, $"bahsedilen-{suffix}@apya.test"), autoSave: true);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
                new TaskItem(taskId, "Bahsetme görevi", assigneeId: assigneeId, now: DateTime.Now), autoSave: true);
        });

        await WithUnitOfWorkAsync(() => GetRequiredService<ITaskAppService>()
            .AddCommentAsync(taskId, "@Biri bakar mısın", new List<Guid> { assigneeId, unknownId }));

        var rows = await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<Notification, Guid>>()
            .GetListAsync(n => n.EntityId == taskId));
        rows.Count(n => n.UserId == assigneeId && n.Type == NotificationType.Mention).ShouldBe(1);
        rows.Count(n => n.UserId == assigneeId && n.Type == NotificationType.TaskCommentAdded).ShouldBe(0);
        rows.ShouldNotContain(n => n.UserId == unknownId);
    }
}
