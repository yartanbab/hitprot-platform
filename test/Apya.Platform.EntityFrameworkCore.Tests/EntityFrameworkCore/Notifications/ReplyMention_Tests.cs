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

/// <summary>B-17 · Yanıtta bahsedilen kişi "Sizden bahsedildi" bildirimi alır (yorumla aynı kural).</summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReplyMention_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Yanitta_bahsedilen_kisi_bildirim_alir()
    {
        var mentioned = Guid.NewGuid();
        var taskId = Guid.NewGuid();
        var suffix = mentioned.ToString("N")[..8];
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(
                new IdentityUser(mentioned, "bahsedilen-" + suffix, $"bahsedilen-{suffix}@apya.test") { Name = "Ayşe", Surname = "Yılmaz" }, autoSave: true);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
                new TaskItem(taskId, "Yanıtlı görev", now: DateTime.Today), autoSave: true);
        });
        var tasks = GetRequiredService<ITaskAppService>();
        var commentId = await tasks.AddCommentAsync(taskId, "İlk yorum");

        await tasks.ReplyToCommentAsync(commentId, "@Ayşe Yılmaz bakar mısın", new List<Guid> { mentioned });

        var mentions = await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<Notification, Guid>>()
            .GetListAsync(n => n.UserId == mentioned && n.EntityId == taskId && n.Type == NotificationType.Mention));
        mentions.Count.ShouldBe(1);
    }
}
