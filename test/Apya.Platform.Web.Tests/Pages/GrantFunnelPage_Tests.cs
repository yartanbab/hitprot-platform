using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>18c · Çağrı dönüşüm hunisi host'a aittir; test host'u host bağlamında koşar.</summary>
public class GrantFunnelPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Host_Huni_Sayfasi_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Funnel");

        html.ShouldContain("Çağrı Dönüşüm Hunisi");
        html.ShouldContain("id=\"FunnelStages\"");
        html.ShouldContain("Son 60 gün");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Funnel[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Funnel.js içermeli");
    }
}
