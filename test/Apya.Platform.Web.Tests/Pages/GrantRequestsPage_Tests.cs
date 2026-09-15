using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Tur 22 · hibe menüsü sadeleşti ve Talepler ekranı kuruldu. Test host'u host bağlamında ve
/// AddAlwaysAllowAuthorization ile koşar: host menüsü ve host ekranları ölçülür.
/// </summary>
public class GrantRequestsPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Talepler_Sayfasi_Iki_Sekme_Ve_Suzgeclerle_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Requests");

        html.ShouldContain("Yanıt bekleyen");
        html.ShouldContain("Yürüyen başvuru");
        html.ShouldContain("href=\"/Grants/Pipeline\"");
        html.ShouldContain("ConsultantFilter");
        html.ShouldContain("CallFilter");
        html.ShouldContain("StateFilter");
        html.ShouldContain("DueStrip");
        html.ShouldContain("RequestRows");
        Regex.IsMatch(html, @"Requests[^""]*\.js").ShouldBeTrue("sayfa demeti Requests.js içermeli");
        // Yanıt bekleyen ekranında pano/liste düğmesi yok: o görünüm yürüyen başvurunun.
        html.ShouldNotContain("apya-req-views");
    }

    [Theory]
    [InlineData("/Grants/Pipeline", "href=\"/Grants/Applications\"")]
    [InlineData("/Grants/Applications", "href=\"/Grants/Pipeline\"")]
    public async Task Pano_Ve_Liste_Taleplerin_Sekme_Basligini_Tasir(string url, string otherView)
    {
        var html = await GetResponseAsStringAsync(url);

        html.ShouldContain("apya-req-tabs");
        html.ShouldContain("href=\"/Grants/Requests\"");
        html.ShouldContain("apya-req-views");
        html.ShouldContain(otherView);
        Regex.IsMatch(html, @"RequestTabs[^""]*\.js").ShouldBeTrue("sekme sayaçları için RequestTabs.js yüklenmeli");
    }

    /// <summary>
    /// Host menüsü farklı nesne başına bir öğe: Bugün · Çağrılar · Talepler · Fikir Havuzu · Raporlar.
    /// Aşamalar sekmeye, şablonlar Ayarlar'a indi; eski öğeler kenar çubuğunda basılmaz.
    /// LeptonX öğe kimliğini "MenuItem_" + ad (nokta → alt çizgi) olarak basar.
    /// </summary>
    [Fact]
    public async Task Host_Hibe_Menusu_Sadelesti()
    {
        var html = await GetResponseAsStringAsync("/Grants/Requests");

        html.ShouldContain("MenuItem_Apya_Grants_Today");
        html.ShouldContain("MenuItem_Apya_Grants_Calls");
        html.ShouldContain("MenuItem_Apya_Grants_Requests");
        html.ShouldContain("MenuItem_Apya_Grants_Ideas");
        html.ShouldContain("MenuItem_Apya_Grants_Reports");

        // Kaynaklar Çağrılar'ın sekmesi oldu (21a/22).
        html.ShouldNotContain("MenuItem_Apya_Grants_Sources");
        html.ShouldNotContain("MenuItem_Apya_Grants_Applications");
        html.ShouldNotContain("MenuItem_Apya_Grants_Pipeline");
        html.ShouldNotContain("MenuItem_Apya_Grants_Interests");
        html.ShouldNotContain("MenuItem_Apya_Grants_Leads");
        html.ShouldNotContain("MenuItem_Apya_Grants_Funnel");
        html.ShouldNotContain("MenuItem_Apya_Grants_StageTemplates");
        html.ShouldNotContain("MenuItem_Apya_Grants_NotificationTemplates");
    }

    [Fact]
    public async Task Ayarlar_Hibe_Grubu_Sablon_Ekranlarini_Tasir()
    {
        var html = await GetResponseAsStringAsync("/Settings");

        html.ShouldContain("apya-settings-group");
        html.ShouldContain("href=\"/Grants/StageTemplates\"");
        html.ShouldContain("href=\"/Grants/NotificationTemplates\"");
    }

    [Fact]
    public void Varsayilan_Igne_Menude_Karsiligi_Olan_Adi_Tasir()
    {
        Apya.Platform.Settings.PlatformSettingDefaults.ShellPins.ShouldContain("Apya.Grants.Requests");
        Apya.Platform.Settings.PlatformSettingDefaults.ShellPins.ShouldNotContain("Apya.Grants.Applications");
    }
}
