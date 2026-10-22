using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA 10-22 · Görev listesi ve kanbandaki hızlı eylemler sunucunun sahiplik kuralını aynalar
/// (oluşturan / atanan ya da Projects.ManageTeam). Aynalamayan düğme başkasının görevinde çıkıp
/// tıklanınca reddediliyordu:
/// <list type="bullet">
/// <item>Kanban kart menüsündeki "Sil" silme izni (Tasks.Delete) olmayan sahibe de çıkıyordu.</item>
/// <item>Proje detayındaki satır üstü "Tamamla" yalnız ChangeStatus'a bakıyordu (/Tasks listesi sahipliğe de bakar).</item>
/// </list>
/// </summary>
public class TaskQuickActionOwnership_Tests
{
    private static string Read(params string[] parts)
        => File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(), Path.Combine(parts)));

    [Fact]
    public void Kanban_sil_silme_iznini_ve_sahipligi_ister()
    {
        var kanban = Read("src", "Apya.Platform.Web", "wwwroot", "js", "apya-kanban.js");
        kanban.ShouldContain("return abp.auth.isGranted('Platform.Tasks.Delete') &&");
    }

    [Fact]
    public void Proje_detayi_tamamla_sahiplik_ister()
    {
        var js = Read("src", "Apya.Platform.Web", "Pages", "Projects", "ProjectDetails.js");
        js.ShouldContain("if (!canChangeStatus || closed || !owns) { return chip; }");
    }
}
