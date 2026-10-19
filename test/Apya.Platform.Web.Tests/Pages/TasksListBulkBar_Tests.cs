using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA-33 · Görevler listesinin toplu çubuğu aynı sayfanın panosuyla eşit. Eskiden yalnız "Durum
/// değiştir" ve "Sil" vardı; pano iptal, erteleme, öncelik ve atama sunuyordu.
/// </summary>
public class TasksListBulkBar_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Liste_toplu_cubugu_panodaki_eylemleri_tasir()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Tasks"));

        html.ShouldContain("id=\"bulk-bar\"");
        html.ShouldContain("id=\"bulk-cancel\"");
        html.ShouldContain("data-bulk-defer=\"7\"");
        html.ShouldContain("data-bulk-priority=\"4\"");
        html.ShouldContain("data-bulk-assign-menu");
    }

    [Fact]
    public void Toplu_eylemler_tekil_uclari_cagirir()
    {
        var js = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Pages", "Tasks", "index.js"));

        js.ShouldContain("taskService.cancel(id, reason");
        js.ShouldContain("taskService.defer(id, days");
        js.ShouldContain("taskService.setPriority(id, priority");
        js.ShouldContain("taskService.setAssignee(id, userId");
    }
}
