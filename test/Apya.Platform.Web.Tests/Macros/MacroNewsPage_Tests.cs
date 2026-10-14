using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Macros;

/// <summary>Haber şeridi kabı ve "Tüm haberler" sayfasının gerçek render'ı (host bağlamı).</summary>
public class MacroNewsPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Makro_ekrani_seridi_gizli_kapla_basar()
    {
        var html = await GetResponseAsStringAsync("/Makro");

        // Şerit istemcide dolar; haber yoksa hiç görünmez — kap gizli doğar.
        Regex.IsMatch(html, @"<section class=""apya-macros-news"" id=""MacrosNews""[^>]*\shidden").ShouldBeTrue();
        html.ShouldContain("data-news-prev");
        Regex.IsMatch(html, @"NewsBanner[^""]*\.js|Macros\.Index[^""]*\.js").ShouldBeTrue();
    }

    [Fact]
    public async Task Tum_haberler_sayfasi_suzgecle_acilir()
    {
        var html = await GetResponseAsStringAsync("/Makro/Haberler");

        html.ShouldContain("apya-macros-newslist");
        html.ShouldContain("href=\"/Makro/Haberler?kind=call\"");
        html.ShouldContain("href=\"/Makro/Haberler?kind=platform\"");
        html.ShouldContain("href=\"/Makro/Haberler?kind=result\"");
        Regex.IsMatch(html, @"class=""apya-macros-newslist-filter is-active"" href=""/Makro/Haberler""").ShouldBeTrue();

        var filtered = await GetResponseAsStringAsync("/Makro/Haberler?kind=call");
        Regex.IsMatch(filtered, @"class=""apya-macros-newslist-filter is-active"" href=""/Makro/Haberler\?kind=call""").ShouldBeTrue();

        // Bilinmeyen süzgeç tümüne düşer, hata vermez.
        var unknown = await GetResponseAsStringAsync("/Makro/Haberler?kind=mevzuat");
        Regex.IsMatch(unknown, @"class=""apya-macros-newslist-filter is-active"" href=""/Makro/Haberler""").ShouldBeTrue();
    }
}
