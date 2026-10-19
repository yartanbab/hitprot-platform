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

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// QA-39 · Görevin zaman kayıtlarında kişi ad soyadla görünür (kullanıcı adı "admin" değil) —
/// yorumlar ve atanan için QA-21/QA-05'te konan tek kural (TaskPersonName).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskDisplayNames_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Zaman_kaydi_ad_soyadla_gorunur()
    {
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var userId = Guid.NewGuid();
        var taskId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            var user = new IdentityUser(userId, "zaman-" + suffix, $"zaman-{suffix}@apya.test") { Name = "Elif", Surname = "Şahin" };
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(user, autoSave: true);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
                new TaskItem(taskId, "Zaman kaydı görevi", now: DateTime.Now), autoSave: true);
            await GetRequiredService<IRepository<TaskTimeLog, Guid>>().InsertAsync(
                new TaskTimeLog(Guid.NewGuid(), taskId, userId, DateTime.Today) { SecondsSpent = 60 }, autoSave: true);
        });

        var logs = await WithUnitOfWorkAsync(() => GetRequiredService<ITaskAppService>().GetTimeLogsAsync(taskId));

        logs.Single().UserName.ShouldBe("Elif Şahin");
    }

    /// <summary>QA-39 · Bildirimdeki "yapan" da ad soyadla yazılır ("admin, ... sizden bahsetti" değil).</summary>
    [Fact]
    public async Task Bildirimde_yapan_ad_soyadla_gorunur()
    {
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var actorId = Guid.NewGuid();
        var mentionedId = Guid.NewGuid();
        var taskId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            var users = GetRequiredService<IIdentityUserRepository>();
            await users.InsertAsync(new IdentityUser(actorId, "yazan-" + suffix, $"yazan-{suffix}@apya.test") { Name = "Elif", Surname = "Şahin" }, autoSave: true);
            await users.InsertAsync(new IdentityUser(mentionedId, "okuyan-" + suffix, $"okuyan-{suffix}@apya.test"), autoSave: true);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
                new TaskItem(taskId, "Bahsetme görevi", now: DateTime.Now), autoSave: true);
        });

        var claims = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, actorId.ToString()),
            new Claim(AbpClaimTypes.UserName, "yazan-" + suffix),
            new Claim(AbpClaimTypes.Name, "Elif"),
            new Claim(AbpClaimTypes.SurName, "Şahin")
        }, "Test"));
        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(claims))
        {
            await WithUnitOfWorkAsync(() => GetRequiredService<ITaskAppService>()
                .AddCommentAsync(taskId, "@Okuyan bakar mısın", new List<Guid> { mentionedId }));
        }

        var row = await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<Notification, Guid>>()
            .SingleAsync(n => n.UserId == mentionedId && n.EntityId == taskId));
        row.Body.ShouldStartWith("Elif Şahin,");
    }
}
