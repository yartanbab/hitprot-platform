using System.Linq;
using System.Net;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Brand;

/// <summary>
/// APYA kilidi (işaret + ad) kabuğa bağlı olmayan sayfalarda gerçekten basılıyor mu.
/// Uygulama kabuğundaki menü logosu salt CSS maskesidir (global.css); onu sayfa
/// testi göremez, tarayıcıda doğrulanır.
/// </summary>
public class BrandLockupPages_Tests : PlatformWebTestBase
{
    private async Task<HtmlDocument> LoadAsync(string url)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(url));
        return doc;
    }

    private static string Word(HtmlNode lockup)
        => WebUtility.HtmlDecode(lockup.SelectSingleNode(".//span[@class='apya-lockup__word']")!.InnerText).Trim();

    [Fact]
    public async Task Giris_sayfasi_masaustu_ve_mobil_icin_APYA_kilidini_basar()
    {
        var doc = await LoadAsync("/Account/Login");

        var lockups = doc.DocumentNode.SelectNodes("//span[@class='apya-lockup']");
        lockups.ShouldNotBeNull();
        lockups.Count.ShouldBe(2, "tanıtım sütunu + dar ekranda kartın üstü");
        foreach (var lockup in lockups)
        {
            Word(lockup).ShouldBe("APYA");
            var mark = lockup.SelectSingleNode(".//svg");
            mark.ShouldNotBeNull();
            mark.GetAttributeValue("class", "").ShouldContain("apya-mark");
            mark.SelectNodes(".//*[contains(@class,'apya-mark__ray')]").Count.ShouldBe(13);
        }

        // Eski indigo yıldız ve "PLATFORM" rozeti kalktı.
        doc.DocumentNode.SelectSingleNode("//*[contains(@class,'apya-auth__badge')]").ShouldBeNull();
        doc.DocumentNode.OuterHtml.ShouldNotContain("#4338CA");

        WebUtility.HtmlDecode(doc.DocumentNode.SelectSingleNode("//title")!.InnerText).ShouldContain("APYA");
    }

    [Fact]
    public async Task Yasal_sayfa_APYA_kilidini_ve_isaret_stilini_basar()
    {
        var doc = await LoadAsync("/aydinlatma-metni");

        var lockup = doc.DocumentNode.SelectSingleNode("//span[@class='apya-lockup']");
        lockup.ShouldNotBeNull();
        Word(lockup).ShouldBe("APYA");
        doc.DocumentNode.OuterHtml.ShouldNotContain("#4338CA");

        // Bu düzen global bundle'a bağlı değil; kilit stili ayrıca yüklenmeli.
        // asp-append-version adı parmak izler: /css/apya-mark.<hash>.css
        doc.DocumentNode.SelectNodes("//link[@rel='stylesheet']")!
            .Select(l => l.GetAttributeValue("href", ""))
            .ShouldContain(h => h.StartsWith("/css/apya-mark."));
    }
}
