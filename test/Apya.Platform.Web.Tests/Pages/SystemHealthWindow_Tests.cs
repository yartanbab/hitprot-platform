using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Web.Pages.Admin.SystemHealth;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Sistem Sağlığı zaman penceresi.
///
/// 1 günlük seçenek olmadan en dar pencere 7 gündü: bir haftalık birikim hep taze
/// görünüyor, "dün ne oldu" ile "bu hafta ne oldu" ayrılamıyordu. Çoktan düzelmiş
/// hatalar güncel sanılıyordu.
/// </summary>
public class SystemHealthWindow_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    [Fact]
    public void Bir_gun_secilebilir_pencereler_arasinda()
    {
        IndexModel.AllowedWindows.ShouldContain(1);
    }

    [Fact]
    public async Task Pencere_secicide_1_gun_dugmesi_basilir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Admin/SystemHealth"));

        var etiketler = doc.DocumentNode
            .SelectNodes("//div[@aria-label='Zaman penceresi']//a")
            ?.Select(a => a.InnerText.Trim())
            .ToList();

        etiketler.ShouldNotBeNull();
        etiketler!.ShouldContain("1 gün");
    }

    [Fact]
    public async Task WindowDays_1_kabul_edilir_ve_7ye_dusurulmez()
    {
        // Regresyon kilidi: AllowedWindows'tan 1 çıkarılırsa OnGetAsync sessizce
        // 7'ye düşürür — sayfa yine 200 döner, kullanıcı yanlış pencereye bakar.
        var doc = Parse(await GetResponseAsStringAsync("/Admin/SystemHealth?windowDays=1"));

        doc.DocumentNode.InnerText.ShouldContain("Son 1 Gün");
    }

    [Fact]
    public async Task Listede_olmayan_pencere_7ye_duser()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Admin/SystemHealth?windowDays=3"));

        doc.DocumentNode.InnerText.ShouldContain("Son 7 Gün");
    }
}
