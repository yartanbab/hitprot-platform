using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Search;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>X-01 · Ctrl K kayıt araması: görev ve proje ada/koda göre bulunur, bağlantı kaydın sayfasıdır.</summary>
public class RecordSearch_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Gorev_ve_proje_adla_bulunur_baglanti_kayit_sayfasidir()
    {
        var token = "Arama" + Guid.NewGuid().ToString("N")[..6];
        Guid projectId, taskId;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var project = new Project(Guid.NewGuid(), null, null, "QA " + token + " projesi", "Q-" + token[^4..], "Arama testi");
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);
            var task = new TaskItem(Guid.NewGuid(), "QA " + token + " görevi", projectId: project.Id, now: DateTime.Now);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);
            projectId = project.Id;
            taskId = task.Id;
            await uow.CompleteAsync();
        }

        var results = await GetRequiredService<IRecordSearchAppService>().SearchAsync(token);

        results.ShouldContain(r => r.Kind == "task" && r.Url == "/Tasks/Detail/" + taskId);
        results.ShouldContain(r => r.Kind == "project" && r.Url == "/Projects/ProjectDetails/" + projectId);
    }

    [Fact]
    public async Task Kisa_sorgu_aramaz()
    {
        (await GetRequiredService<IRecordSearchAppService>().SearchAsync("a")).ShouldBeEmpty();
    }

    [Fact]
    public void Palet_kayit_sonuclarini_sorgu_ayniysa_basar()
    {
        var js = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "wwwroot", "js", "command-palette.js"));
        js.ShouldContain("apya.platform.search.recordSearch");
        js.ShouldContain("if ((input.value || '').trim() !== raw) { return; }");
        js.ShouldContain("group: 'KAYITLAR'");
    }
}
