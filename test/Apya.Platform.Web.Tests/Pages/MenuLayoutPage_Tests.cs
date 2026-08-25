using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.SettingManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Menü düzeni — kenar çubuğu ile Ayarlar sayfası arasında öğe taşıma.
///
/// Test host'u AddAlwaysAllowAuthorization kullanır: sayfalar TAM render olur,
/// böylece hem düzenleme ekranının markup'ı hem de düzenin İKİ yüzeye birden
/// uygulanması aynı istekte ölçülebilir. Düzen ayarı GLOBAL seviyeye yazılır —
/// resolver ISettingProvider ile okuduğu için zincirden aynen döner.
/// </summary>
public class MenuLayoutPage_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>Ayarlar sayfasındaki yönetim listesinin bağlantı adresleri.</summary>
    private static string[] SettingsLinkUrls(string html)
    {
        var list = Parse(html).DocumentNode
            .SelectSingleNode("//ul[contains(@class,'apya-settings-links')]");

        return list?.SelectNodes(".//a[@href]")
                   ?.Select(a => a.GetAttributeValue("href", ""))
                   .ToArray()
               ?? System.Array.Empty<string>();
    }

    /// <summary>Kenar çubuğu menüsündeki bağlantı adresleri.</summary>
    private static string[] SidebarUrls(string html)
    {
        var menu = Parse(html).DocumentNode
            .SelectSingleNode("//ul[contains(@class,'lpx-nav-menu')]");

        return menu?.SelectNodes(".//a[@href]")
                   ?.Select(a => a.GetAttributeValue("href", ""))
                   .ToArray()
               ?? System.Array.Empty<string>();
    }

    private async Task SetLayoutAsync(string json)
    {
        await GetRequiredService<ISettingManager>()
            .SetGlobalAsync(PlatformSettings.Shell.MenuLayout, json);
    }

    // ── Varsayılan (düzen yok) ───────────────────────────────────────────────

    [Fact]
    public async Task Duzen_yokken_yonetim_hedefleri_Ayarlar_sayfasinda_durur()
    {
        var html = await GetResponseAsStringAsync("/Settings");

        SettingsLinkUrls(html).ShouldContain("/TenantManagement/Tenants");
        // Kenar çubuğunda "Yönetim" grubu doğmaz — kimse oraya bir şey taşımadı.
        SidebarUrls(html).ShouldNotContain("/TenantManagement/Tenants");
    }

    [Fact]
    public async Task Duzenleme_ekrani_iki_sutunu_da_basar()
    {
        var html = await GetResponseAsStringAsync("/Settings/Menu");

        html.ShouldContain("data-nav-root=\"true\"");
        html.ShouldContain("data-nav-settings-list=\"true\"");
        // Kenar çubuğu sütunundan bir yaprak ve Ayarlar sütunundan bir hedef.
        html.ShouldContain("data-nav-node=\"Apya.Work.Projects\"");
        html.ShouldContain("data-nav-node=\"Apya.Admin.Tenants\"");
    }

    /// <summary>
    /// "Ayarlar" girişi kullanıcı düzeninin parçası DEĞİL: taşınabilseydi
    /// kullanıcının düzeni geri alacağı ekran kaybolurdu.
    /// </summary>
    [Fact]
    public async Task Ayarlar_girisi_kilitli_ve_tasinamaz()
    {
        var html = await GetResponseAsStringAsync("/Settings/Menu");

        var row = Parse(html).DocumentNode
            .SelectSingleNode("//li[@data-nav-node='Apya.Settings']");

        row.ShouldNotBeNull();
        row.GetAttributeValue("data-nav-locked", "").ShouldBe("true");
        row.SelectNodes(".//button[@data-nav-to-settings]").ShouldBeNull();
        row.SelectNodes(".//button[@data-nav-up]").ShouldBeNull();
    }

    // ── Düzen uygulanmış ─────────────────────────────────────────────────────

    /// <summary>
    /// Asıl sözleşme: bir hedef AYNI ANDA iki yüzeyde durmaz. Taşınan öğe
    /// gittiği yerde görünür, geldiği yerden kaybolur.
    /// </summary>
    [Fact]
    public async Task Tasinan_ogeler_iki_yuzey_arasinda_yer_degistirir()
    {
        await SetLayoutAsync("""
            {"toSidebar":["Apya.Admin.Tenants"],"toSettings":["Apya.Platform.Consents"]}
            """);

        var html = await GetResponseAsStringAsync("/Settings");
        var settings = SettingsLinkUrls(html);
        var sidebar = SidebarUrls(html);

        // Kiracı Yönetimi: Ayarlar → kenar çubuğu
        settings.ShouldNotContain("/TenantManagement/Tenants");
        sidebar.ShouldContain("/TenantManagement/Tenants");

        // Onaylar: kenar çubuğu → Ayarlar
        sidebar.ShouldNotContain("/Admin/Consent");
        settings.ShouldContain("/Admin/Consent");
    }

    [Fact]
    public async Task Bolum_sirasi_kayitli_duzene_gore_uygulanir()
    {
        await SetLayoutAsync("""
            {"sections":["Apya.Reports","Apya.Finance","Apya.Dashboard"]}
            """);

        var sidebar = SidebarUrls(await GetResponseAsStringAsync("/Settings"));

        // Bölüm başlıklarının URL'si yok; ilk çocuklarının sırasıyla ölçülür.
        var reports = System.Array.IndexOf(sidebar, "/Reports");
        var cash = System.Array.IndexOf(sidebar, "/CashAccounts");
        var dashboard = System.Array.IndexOf(sidebar, "/Dashboard");

        reports.ShouldBeGreaterThan(-1);
        cash.ShouldBeGreaterThan(-1);
        dashboard.ShouldBeGreaterThan(-1);
        reports.ShouldBeLessThan(cash);
        cash.ShouldBeLessThan(dashboard);
    }

    [Fact]
    public async Task Grup_ici_sira_kayitli_duzene_gore_uygulanir()
    {
        await SetLayoutAsync("""
            {"items":{"Apya.Finance":["Apya.Finance.ExchangeRates","Apya.Finance.CashAccounts"]}}
            """);

        var sidebar = SidebarUrls(await GetResponseAsStringAsync("/Settings"));

        System.Array.IndexOf(sidebar, "/ExchangeRates")
            .ShouldBeLessThan(System.Array.IndexOf(sidebar, "/CashAccounts"));
    }

    /// <summary>
    /// Bir bölümün TÜM yaprakları Ayarlar'a inerse başlık kenar çubuğunda
    /// kalmamalı — LeptonX içi boş bir bölüm başlığı basar.
    /// </summary>
    [Fact]
    public async Task Tum_cocuklari_tasinan_bolum_kenar_cubugundan_dusr()
    {
        await SetLayoutAsync("""
            {"toSettings":["Apya.Content.Documents","Apya.Content.DynamicAssets"]}
            """);

        var html = await GetResponseAsStringAsync("/Settings");

        SidebarUrls(html).ShouldNotContain("/Documents");
        Parse(html).DocumentNode
            .SelectSingleNode("//ul[contains(@class,'lpx-nav-menu')]")
            .InnerText.ShouldNotContain("İçerik");
    }

    /// <summary>
    /// Kayıtlı düzende adı geçmeyen öğe kaybolmamalı: sonradan koda eklenen bir
    /// menü girişi, eski bir düzen yüzünden menüden düşerse sessiz veri kaybı olur.
    /// </summary>
    [Fact]
    public async Task Duzende_adi_gecmeyen_oge_menude_kalir()
    {
        await SetLayoutAsync("""{"sections":["Apya.Reports"]}""");

        SidebarUrls(await GetResponseAsStringAsync("/Settings"))
            .ShouldContain("/Dashboard");
    }

    /// <summary>
    /// Yetkisi olmayan bir hedef, düzen ayarında "kenar çubuğuna al" dense bile
    /// basılmamalı. Düzen bir SIRA/KONUM bildirimidir, yetki kapısı değildir.
    /// (Burada test host'u her izni verdiği için ters yön ölçülür: tanınmayan
    /// ad sessizce yok sayılır, menü çökmez.)
    /// </summary>
    [Fact]
    public async Task Taninmayan_ad_yok_sayilir()
    {
        await SetLayoutAsync("""
            {"toSidebar":["Apya.Admin.YokBoyleBirSey"],
             "toSettings":["Apya.Yok.Bu.Da"],
             "sections":["Apya.Hayali"]}
            """);

        var html = await GetResponseAsStringAsync("/Settings");

        SidebarUrls(html).ShouldContain("/Dashboard");
        SettingsLinkUrls(html).ShouldContain("/TenantManagement/Tenants");
    }

    /// <summary>
    /// Dip bloktaki ipucu artık sabit değil; kullanıcının GERÇEKTEN gördüğü
    /// hedeflerden üretilir (ApyaThemeHead → #ApyaShellNav).
    /// </summary>
    [Fact]
    public async Task Dip_blok_ipucu_gercek_listeden_uretilir()
    {
        await SetLayoutAsync("""{"toSidebar":["Apya.Admin.Tenants"]}""");

        var html = await GetResponseAsStringAsync("/Settings");
        var block = Parse(html).DocumentNode.SelectSingleNode("//script[@id='ApyaShellNav']");

        block.ShouldNotBeNull();
        // Kenar çubuğuna alınan hedef ipucunda YER ALMAZ.
        block.InnerText.ShouldNotContain("Kiracı Yönetimi");
        block.InnerText.ShouldContain("settingsHint");
    }
}
