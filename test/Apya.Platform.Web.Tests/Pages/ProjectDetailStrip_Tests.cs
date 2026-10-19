using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Pages;

/// <summary>
/// QA-12 + QA-06 · Proje detayı şeridi ve Finans sekmesi görev sayılarını TEK kuraldan
/// (ProjectTaskProgress) okur. Eskiden GetDetailAsync ilerleme alanlarını hiç doldurmuyordu:
/// Finans sekmesi her projede "Görev ilerlemesi %0" gösteriyordu (şerit aynı sayfada %17
/// derken). Şerit ayrıca sayfa içi görev yazmalarından sonra yenilenmiyordu.
/// </summary>
public class ProjectDetailStrip_Tests : PlatformWebTestBase
{
    private async Task<Guid> CreateProjectWithTasksAsync(string code)
    {
        var projectId = Guid.NewGuid();
        var today = DateTime.Today;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Şerit " + code, code, "Şerit testi"), autoSave: true);

            var tasks = GetRequiredService<IRepository<TaskItem, Guid>>();
            var done = new TaskItem(Guid.NewGuid(), "Biten", projectId: projectId, dueDate: today.AddDays(-3), now: DateTime.Now);
            done.ChangeStatus(TaskStatus.Done, DateTime.Now);
            var cancelled = new TaskItem(Guid.NewGuid(), "İptal", projectId: projectId, dueDate: today.AddDays(-2), now: DateTime.Now);
            cancelled.Cancel("test", DateTime.Now);
            await tasks.InsertAsync(done, autoSave: true);
            await tasks.InsertAsync(cancelled, autoSave: true);
            await tasks.InsertAsync(new TaskItem(Guid.NewGuid(), "Gecikmiş", projectId: projectId, dueDate: today.AddDays(-1), now: DateTime.Now), autoSave: true);
            await tasks.InsertAsync(new TaskItem(Guid.NewGuid(), "Yakında", projectId: projectId, dueDate: today.AddDays(3), now: DateTime.Now), autoSave: true);
            await uow.CompleteAsync();
        }

        return projectId;
    }

    [Fact]
    public async Task Finans_sekmesi_gorev_ilerlemesini_serit_ile_ayni_gosterir()
    {
        var projectId = await CreateProjectWithTasksAsync("SRT-1");
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}"));

        // 1 biten / 4 görev (iptal paydada) = %25.
        html.ShouldContain("· 1/4");
        var finance = html.IndexOf("Görev ilerlemesi", StringComparison.Ordinal);
        finance.ShouldBeGreaterThan(0);
        html.Substring(finance, 200).ShouldContain("%25", customMessage: "Finans sekmesi %0 gösteriyordu");
    }

    [Fact]
    public void Serit_sayfa_ici_yazmalardan_sonra_tek_kuraldan_tazelenir()
    {
        var js = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Pages", "Projects", "ProjectDetails.js"));

        js.ShouldContain("document.addEventListener(apya.dataChanged.EVENT");
        js.ShouldContain("projectService.getTaskSummary(projectId");
    }
}
