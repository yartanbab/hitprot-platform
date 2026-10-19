using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Dashboard;

/// <summary>
/// QA-46 · Çok sayıda gecikmiş iş varken teslim kartı dönemin işini yine gösterir; gecikmişler
/// "Gecikmiş" grubunda, sınırlı ve en yeni gecikme önce gelir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DashboardDeliveriesOverdue_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public async Task Gecikmisler_donemin_isini_kalabalikta_birakmaz()
    {
        var today = GetRequiredService<IClock>().Now.Date;
        var projectId = Guid.NewGuid();
        var upcomingId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Teslim Projesi", "TS-" + projectId.ToString("N")[..4], "açıklama"), autoSave: true);
            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            // Paylaşılan test veritabanında başka testlerin yakın tarihli gecikmişlerini itmesin diye eski tarihler.
            for (var k = 30; k < 42; k++)
            {
                await tasks.InsertAsync(new TaskItem(Guid.NewGuid(), "Gecikmiş " + k, projectId: projectId,
                    startDate: today.AddDays(-90), dueDate: today.AddDays(-k)), autoSave: true);
            }
            await tasks.InsertAsync(new TaskItem(upcomingId, "Bugün teslim", projectId: projectId,
                startDate: today.AddDays(-1), dueDate: today), autoSave: true);
        });

        var items = await WithUnitOfWorkAsync(() => GetRequiredService<IDashboardAppService>()
            .GetDeliveriesAsync(new DashboardQueryDto { Range = DashboardDateRange.Month, ProjectId = projectId }));

        items.ShouldContain(i => i.TaskId == upcomingId && i.GroupKey == DeliveryGroup.ThisWeek);
        var overdue = items.Where(i => i.State == DeliveryState.Overdue).ToList();
        overdue.Count.ShouldBe(10);
        overdue.ShouldAllBe(i => i.GroupKey == DeliveryGroup.Overdue);
        overdue[0].OverdueDays.ShouldBe(30); // en yeni gecikme önce
    }
}
