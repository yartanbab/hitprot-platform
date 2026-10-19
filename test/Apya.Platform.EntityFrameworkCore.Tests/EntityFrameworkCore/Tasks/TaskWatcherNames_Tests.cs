using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>B-15 · Görev detayı izleyenlerin adlarını taşır (ad soyad kuralı).</summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskWatcherNames_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Gorev_detayi_izleyenleri_ad_soyadla_tasir()
    {
        var userId = Guid.NewGuid();
        var taskId = Guid.NewGuid();
        var suffix = userId.ToString("N")[..8];
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IIdentityUserRepository>().InsertAsync(
                new IdentityUser(userId, "izleyen-" + suffix, $"izleyen-{suffix}@apya.test") { Name = "Zeynep", Surname = "Kara" }, autoSave: true);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(
                new TaskItem(taskId, "İzlenen görev", now: DateTime.Today), autoSave: true);
            await GetRequiredService<IRepository<TaskWatcher, Guid>>().InsertAsync(
                new TaskWatcher(Guid.NewGuid(), taskId, userId), autoSave: true);
        });

        var dto = await GetRequiredService<ITaskAppService>().GetAsync(taskId);

        dto.WatcherNames.ShouldBe(new[] { "Zeynep Kara" });
    }
}
