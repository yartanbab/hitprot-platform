using System.IO;
using System.Linq;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA turu 19.10 · Projeler listesi tutarlılığı (betik ↔ sunucu bağları derleyicinin dışında).
/// </summary>
public class ProjectsListConsistency_Tests
{
    private static string Web(params string[] parts) =>
        File.ReadAllText(Path.Combine(new[] { WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Web" }.Concat(parts).ToArray()));

    /// <summary>QA-03 · Host "tüm projeler" görünümünde aynı ad+kodlu projeler kiracı adıyla ayrılır.</summary>
    [Fact]
    public void Kart_ve_satir_kiraci_adini_gosterir_arama_da_kapsar()
    {
        var js = Web("Pages", "Projects", "Index.js");

        js.ShouldContain("esc(p.code) + '</span>' + tenantHtml(p) + chips.join('')", customMessage: "liste satırı");
        js.Split("esc(p.code) + '</span>' + tenantHtml(p)").Length.ShouldBe(3, "liste satırı ve kart");
        js.ShouldContain("lower(p.tenantName).indexOf(q) >= 0");
    }

    /// <summary>QA-04 · "Oluştur ve görev ekle" detaya gidip Yeni Görev penceresini açar.</summary>
    /// <summary>QA-35 · KPI kutucukları "yalnız bana atananlar" kapsamını izler (çiplerle aynı küme).</summary>
    [Fact]
    public void Kpi_kutucuklari_kapsami_izler()
    {
        var js = Web("Pages", "Projects", "Index.js");
        js.ShouldContain("var all = state.myScope");
        js.ShouldContain("? state.items.filter(function (p) { return p.isAssignedToMe; })");
        js.ShouldContain("if (!state.items.length && (state.loading || state.loadFailed))");
    }

    [Fact]
    public void Olustur_ve_gorev_ekle_yeni_gorev_penceresini_acar()
    {
        Web("Pages", "Projects", "Index.js").ShouldContain("'/Projects/ProjectDetails/' + result.id + '?yeniGorev=1'");
        var details = Web("Pages", "Projects", "ProjectDetails.js");
        details.ShouldContain("startUrl.searchParams.has('yeniGorev')");
        details.ShouldContain("$('#btn-create-task').trigger('click');");
    }

    /// <summary>
    /// Panel açıkken yerel yeniden hesap sunucuyla AYNI gün düzeyi kuralı uygular (C#→JS sözleşmesi):
    /// saat düzeyinde kalsaydı panelde bir işlem sonrası bugün biten görev kartta gecikmiş görünürdü.
    /// </summary>
    [Fact]
    public void Panel_yerel_hesabi_gun_duzeyinde()
    {
        var js = Web("Pages", "Projects", "Index.js");

        js.ShouldNotContain("Date.parse(t.dueDate) < now");
        js.ShouldContain("dueDay(t) < today");
        js.ShouldContain("p.dueSoonTaskCount = ");
    }
}
