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
}
