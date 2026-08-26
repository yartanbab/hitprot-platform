using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Web.Bundling;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Island chunk'larının <c>&lt;link rel="modulepreload"&gt;</c> olarak basılması.
///
/// Kritik iddia GEÇİŞLİ bağımlılıktır: ui-vendor, dashboard entry'sinin doğrudan
/// import'u DEĞİL (Dialog üzerinden bağlı). Doğrudan import'larla yetinen bir
/// uygulama bu testi geçemez — ve tam da en büyük chunk preload'sız kalırdı.
/// </summary>
public class IslandPreload_Tests : PlatformWebTestBase
{
    private static string[] PreloadHrefs(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var nodes = doc.DocumentNode.SelectNodes("//link[@rel='modulepreload']");
        return nodes == null
            ? System.Array.Empty<string>()
            : nodes.Select(n => n.GetAttributeValue("href", string.Empty)).ToArray();
    }

    [Fact]
    public async Task Dashboard_chunk_grafigini_modulepreload_eder()
    {
        var hrefs = PreloadHrefs(await GetResponseAsStringAsync("/Dashboard"));

        hrefs.ShouldNotBeEmpty();
        hrefs.ShouldAllBe(h => h.StartsWith("/js/"));

        // Doğrudan import — grafiğin ilk seviyesi.
        hrefs.ShouldContain(h => h.Contains("react-vendor"));
        // GEÇİŞLİ import — asıl kazanç burada.
        hrefs.ShouldContain(h => h.Contains("ui-vendor"));
    }

    [Fact]
    public async Task Entry_dosyasinin_kendisi_preload_edilmez()
    {
        // Entry'yi <script src> zaten çeker; ikinci kez preload etmek mükerrer
        // indirme değil ama gereksiz bir satır — sözleşmeyi sabitliyoruz.
        var hrefs = PreloadHrefs(await GetResponseAsStringAsync("/Dashboard"));

        hrefs.ShouldNotContain("/js/dashboard.js");
    }

    [Fact]
    public void Bilinmeyen_entry_bos_doner()
    {
        var manifest = GetRequiredService<IslandAssetManifest>();

        manifest.GetPreloadUrls("boyle-bir-island-yok").ShouldBeEmpty();
    }

    [Fact]
    public void Manifest_gecisli_grafigi_cozer()
    {
        var manifest = GetRequiredService<IslandAssetManifest>();

        var urls = manifest.GetPreloadUrls("dashboard");

        urls.ShouldContain(u => u.Contains("ui-vendor"));
        // Aynı chunk iki island yolundan gelse de tek kez listelenir.
        urls.Distinct().Count().ShouldBe(urls.Count);
    }
}
