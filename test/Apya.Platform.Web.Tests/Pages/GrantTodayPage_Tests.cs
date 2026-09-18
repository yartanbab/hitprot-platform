using System.Linq;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 11a/11b · "Bugün" — test host'u host bağlamında render eder (11b kabuğu).
/// Kiracı kabuğunun içeriği EF testlerinde (<c>GrantToday_Tests</c>) doğrulanır.
/// </summary>
public class GrantTodayPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Bugun_Sayfasi_Host_Kabuguyla_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Today");

        html.ShouldContain("apya-today");
        html.ShouldContain("data-host=\"1\"");
        html.ShouldContain("TodayItems");
        html.ShouldContain("Benim işlerim");
        html.ShouldContain("Firmada bekleyen");
        html.ShouldContain("Kurumda");
        // Host kabuğunda kiracı bölümleri (fırsat, başvurular, danışman kartı) çizilmez.
        html.ShouldNotContain("TodayOpportunity");
        html.ShouldNotContain("TodayConsultant\"");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Today[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Today.js içermeli");
    }

    [Fact]
    public async Task Menu_Bugun_Girisini_Tasiyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Today");

        html.ShouldContain("/Grants/Today");
        html.ShouldContain("MenuItem_Apya_Grants_Today");
    }

    /// <summary>
    /// Betikteki adres derleyiciden geçmez: Bugün ekranı projeye <c>/Projects/Detail?id=</c> ile gidiyordu,
    /// sayfanın adı ise <c>ProjectDetails</c> — tıklayan 404 alıyordu.
    /// </summary>
    [Fact]
    public void Hibe_Betiklerindeki_Proje_Baglantilari_Var_Olan_Sayfaya_Gider()
    {
        var web = System.IO.Path.GetFullPath(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(),
            "..", "..", "..", "..", "..", "src", "Apya.Platform.Web"));
        var scripts = System.IO.Directory.GetFiles(System.IO.Path.Combine(web, "Pages", "Grants"), "*.js");
        scripts.ShouldNotBeEmpty($"Betik bulunamadı: {web}");

        var broken = scripts
            .SelectMany(f => System.Text.RegularExpressions.Regex
                .Matches(System.IO.File.ReadAllText(f), @"'/Projects/(?<page>[A-Za-z]+)")
                .Select(m => (File: System.IO.Path.GetFileName(f), Page: m.Groups["page"].Value)))
            .Where(x => !System.IO.File.Exists(System.IO.Path.Combine(web, "Pages", "Projects", x.Page + ".cshtml")))
            .Select(x => $"{x.File} → /Projects/{x.Page}")
            .ToList();

        broken.ShouldBeEmpty("Var olmayan proje sayfasına giden bağlantı: " + string.Join(", ", broken));
    }
}
