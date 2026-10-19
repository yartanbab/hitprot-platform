using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>QA-27 · Son tarihe göre sıralama: yakın olan önce, son tarihsiz görevler sonda (her sağlayıcıda).</summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskListDueDateSort_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Son_tarihsiz_gorevler_sona_gider()
    {
        var projectId = Guid.NewGuid();
        var suffix = projectId.ToString("N")[..6];
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Sıra Projesi " + suffix, "SR-" + suffix[..4], "açıklama"), autoSave: true);
            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            await tasks.InsertAsync(new TaskItem(Guid.NewGuid(), "C tarihsiz", projectId: projectId, now: DateTime.Today), autoSave: true);
            await tasks.InsertAsync(new TaskItem(Guid.NewGuid(), "B uzak", projectId: projectId, dueDate: DateTime.Today.AddDays(20), now: DateTime.Today), autoSave: true);
            await tasks.InsertAsync(new TaskItem(Guid.NewGuid(), "A yakın", projectId: projectId, dueDate: DateTime.Today.AddDays(2), now: DateTime.Today), autoSave: true);
        });

        var list = await GetRequiredService<ITaskAppService>().GetListAsync(new GetTasksInput
        {
            ProjectId = projectId, Sorting = "dueDate asc", MaxResultCount = 10
        });

        list.Items.Select(t => t.Title).ShouldBe(new[] { "A yakın", "B uzak", "C tarihsiz" });
    }
}
