using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// P-04 · Proje sayfasındaki liste görünümünün toplu işlem çubuğu panodakiyle eşit: eskiden yalnız
/// "Durum değiştir" ve "Sil" vardı; atama, öncelik, erteleme, iş adımı ve nedenli iptal için
/// görevleri tek tek açmak gerekiyordu. Uçlar (SetAssignee, SetPriority, Defer, SetWorkStep, Cancel)
/// zaten vardı.
/// </summary>
public class ProjectListBulkBar_Tests : PlatformWebTestBase
{
    private async Task<Guid> CreateProjectAsync(string code)
    {
        var projectId = Guid.NewGuid();
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Toplu İşlem " + code, code, "Toplu işlem çubuğu testi"),
                autoSave: true);
            await uow.CompleteAsync();
        }

        return projectId;
    }

    [Fact]
    public async Task Liste_toplu_cubugu_panodaki_eylemleri_tasir()
    {
        var projectId = await CreateProjectAsync("TOP-1");
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}"));

        html.ShouldContain("id=\"bulk-bar\"");
        html.ShouldContain("id=\"bulk-cancel\"");
        html.ShouldContain("data-bulk-defer=\"1\"");
        html.ShouldContain("data-bulk-defer=\"3\"");
        html.ShouldContain("data-bulk-defer=\"7\"");
        html.ShouldContain("data-bulk-priority=\"4\"");
        html.ShouldContain("data-bulk-assign-menu");
        html.ShouldContain("data-bulk-workstep-menu");
    }

    /// <summary>Çubuğun her düğmesi var olan tekil uca gider (betik ↔ servis bağı derleyicinin dışında).</summary>
    [Fact]
    public void Toplu_eylemler_tekil_uclari_sirayla_cagirir()
    {
        var js = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Pages", "Projects", "ProjectDetails.js"));

        js.ShouldContain("taskService.cancel(id, reason");
        js.ShouldContain("taskService.defer(id, days");
        js.ShouldContain("taskService.setPriority(id, priority");
        js.ShouldContain("taskService.setAssignee(id, userId");
        js.ShouldContain("taskService.setWorkStep(id, stepId");
    }
}
