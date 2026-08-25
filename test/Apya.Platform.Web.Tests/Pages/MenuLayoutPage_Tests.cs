using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.SettingManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Menü düzeni — kenar çubuğu ile Ayarlar sayfası arasında serbest yerleşim.
///
/// Test host'u AddAlwaysAllowAuthorization kullanır: sayfalar TAM render olur,
/// böylece düzenin İKİ yüzeye birden uygulanması aynı istekte ölçülebilir.
/// Düzen GLOBAL seviyeye yazılır — resolver ISettingProvider ile okuduğu için
/// zincirden aynen döner.
/// </summary>
public class MenuLayoutPage_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>
    /// HtmlAgilityPack InnerText'i KAÇIŞLI döndürür ("İçerik" → "&#x130;&#xE7;erik").
    /// Ham hâliyle karşılaştırmak, Türkçe metinde "içermemeli" iddialarını her
    /// koşulda geçen sahte bir teste çevirir.
    /// </summary>
    private static string Text(HtmlNode node)
    {
        return HtmlEntity.DeEntitize(node.InnerText).Trim();
    }

    /// <summary>Ayarlar sayfasındaki yönetim listesinin bağlantı adresleri.</summary>
    private static string[] SettingsLinkUrls(string html)
    {
        var list = Parse(html).DocumentNode
            .SelectSingleNode("//ul[contains(@class,'apya-settings-links')]");

        return list?.SelectNodes(".//a[@href]")
                   ?.Select(a => a.GetAttributeValue("href", ""))
                   .ToArray()
               ?? Array.Empty<string>();
    }

    /// <summary>Kenar çubuğu menüsündeki bağlantı adresleri.</summary>
    private static string[] SidebarUrls(string html)
    {
        var menu = Parse(html).DocumentNode
            .SelectSingleNode("//ul[contains(@class,'lpx-nav-menu')]");

        return menu?.SelectNodes(".//a[@href]")
                   ?.Select(a => a.GetAttributeValue("href", ""))
                   .ToArray()
               ?? Array.Empty<string>();
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

        html.ShouldContain("data-nav-root=\"sidebar\"");
        html.ShouldContain("data-nav-root=\"settings\"");
        html.ShouldContain("data-nav-node=\"Apya.Work.Projects\"");
        html.ShouldContain("data-nav-node=\"Apya.Admin.Tenants\"");
    }

    /// <summary>
    /// Grup satırı da taşınabilir olmalı: kullanıcı bir kategoriyi bütün hâlinde
    /// indirebiliyor (2026-08-25 kararı).
    /// </summary>
    [Fact]
    public async Task Grup_satirinda_da_tasima_dugmesi_var()
    {
        var html = await GetResponseAsStringAsync("/Settings/Menu");

        var group = Parse(html).DocumentNode
            .SelectSingleNode("//li[@data-nav-node='Apya.AiCenter']");

        group.ShouldNotBeNull();
        group.GetAttributeValue("data-nav-kind", "").ShouldBe("group");
        group.SelectSingleNode(".//button[@data-nav-to-settings]").ShouldNotBeNull();
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

    [Fact]
    public async Task Kilitli_Ayarlar_girisi_duzende_adi_gecse_bile_kenar_cubugunda_kalir()
    {
        await SetLayoutAsync("""{"settingsOrder":["Apya.Settings"]}""");

        SidebarUrls(await GetResponseAsStringAsync("/Settings")).ShouldContain("/Settings");
    }

    // ── Sütunlar arası taşıma ────────────────────────────────────────────────

    /// <summary>
    /// Asıl sözleşme: bir hedef AYNI ANDA iki yüzeyde durmaz. Taşınan öğe
    /// gittiği yerde görünür, geldiği yerden kaybolur.
    /// </summary>
    [Fact]
    public async Task Tasinan_ogeler_iki_yuzey_arasinda_yer_degistirir()
    {
        await SetLayoutAsync("""
            {"settingsOrder":["Apya.Platform.Consents"],
             "items":{"Apya.Management":["Apya.Admin.Tenants"]}}
            """);

        var html = await GetResponseAsStringAsync("/Settings");
        var settings = SettingsLinkUrls(html);
        var sidebar = SidebarUrls(html);

        // Kiracı Yönetimi: Ayarlar → kenar çubuğunun "Yönetim" grubu
        settings.ShouldNotContain("/TenantManagement/Tenants");
        sidebar.ShouldContain("/TenantManagement/Tenants");

        // Onaylar: kenar çubuğu → Ayarlar
        sidebar.ShouldNotContain("/Admin/Consent");
        settings.ShouldContain("/Admin/Consent");
    }

    /// <summary>
    /// Bir kategori bütün hâlinde Ayarlar'a inebilir: başlık + altındaki
    /// bağlantılar orada görünür, kenar çubuğunda hiçbiri kalmaz.
    /// </summary>
    [Fact]
    public async Task Kategori_butun_halinde_Ayarlar_sayfasina_iner()
    {
        await SetLayoutAsync("""{"settingsOrder":["Apya.Content"]}""");

        var html = await GetResponseAsStringAsync("/Settings");

        SidebarUrls(html).ShouldNotContain("/Documents");
        SettingsLinkUrls(html).ShouldContain("/Documents");
        SettingsLinkUrls(html).ShouldContain("/DynamicAssets");

        // Grup başlığıyla birlikte basılır — düz bağlantı yığını değil.
        var group = Parse(html).DocumentNode
            .SelectSingleNode("//li[contains(@class,'apya-settings-group')]");
        group.ShouldNotBeNull();
        Text(group.SelectSingleNode(".//span[contains(@class,'apya-settings-group-title')]"))
            .ShouldBe("İçerik");
    }

    /// <summary>Bir madde başka bir bölüme taşınabilir (serbest yerleşim).</summary>
    [Fact]
    public async Task Madde_baska_bir_gruba_tasinabilir()
    {
        await SetLayoutAsync("""
            {"items":{"Apya.Platform":["Apya.Finance.ExchangeRates","Apya.Platform.Notifications"]}}
            """);

        var sidebar = SidebarUrls(await GetResponseAsStringAsync("/Settings"));

        // Kurlar hâlâ menüde ama artık Platform bölümünün ilk maddesi.
        sidebar.ShouldContain("/ExchangeRates");
        Array.IndexOf(sidebar, "/ExchangeRates")
            .ShouldBeLessThan(Array.IndexOf(sidebar, "/Notifications"));
        // Finans'ta kalan iki madde bozulmadı.
        sidebar.ShouldContain("/CashAccounts");
    }

    // ── Sıralama ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task Bolum_sirasi_kayitli_duzene_gore_uygulanir()
    {
        await SetLayoutAsync("""
            {"sections":["Apya.Reports","Apya.Finance","Apya.Dashboard"]}
            """);

        var sidebar = SidebarUrls(await GetResponseAsStringAsync("/Settings"));

        // Bölüm başlıklarının URL'si yok; ilk çocuklarının sırasıyla ölçülür.
        var reports = Array.IndexOf(sidebar, "/Reports");
        var cash = Array.IndexOf(sidebar, "/CashAccounts");
        var dashboard = Array.IndexOf(sidebar, "/Dashboard");

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

        Array.IndexOf(sidebar, "/ExchangeRates")
            .ShouldBeLessThan(Array.IndexOf(sidebar, "/CashAccounts"));
    }

    // ── Dayanıklılık ─────────────────────────────────────────────────────────

    /// <summary>
    /// Tüm çocukları taşınan bölüm kenar çubuğunda kalmamalı — LeptonX içi boş
    /// bir bölüm başlığı basar.
    /// </summary>
    [Fact]
    public async Task Tum_cocuklari_tasinan_bolum_kenar_cubugundan_duser()
    {
        await SetLayoutAsync("""
            {"settingsOrder":["Apya.Content.Documents","Apya.Content.DynamicAssets"]}
            """);

        var html = await GetResponseAsStringAsync("/Settings");

        SidebarUrls(html).ShouldNotContain("/Documents");
        Text(Parse(html).DocumentNode.SelectSingleNode("//ul[contains(@class,'lpx-nav-menu')]"))
            .ShouldNotContain("İçerik");
    }

    /// <summary>
    /// Boşalan grup düzenleme ekranında GERİ GELİR: serbest yerleşimde boş bir
    /// grup geçerli bir bırakma hedefidir, görünmezse geri dönüş yolu kapanır.
    /// </summary>
    [Fact]
    public async Task Bosalan_grup_duzenleme_ekraninda_gorunmeye_devam_eder()
    {
        await SetLayoutAsync("""
            {"settingsOrder":["Apya.Content.Documents","Apya.Content.DynamicAssets"]}
            """);

        var html = await GetResponseAsStringAsync("/Settings/Menu");

        html.ShouldContain("data-nav-node=\"Apya.Content\"");
        // Yönetim grubu da (hiç kullanılmasa bile) hedef olarak durur.
        html.ShouldContain("data-nav-node=\"Apya.Management\"");
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

    [Fact]
    public async Task Taninmayan_ad_yok_sayilir()
    {
        await SetLayoutAsync("""
            {"sections":["Apya.Hayali"],
             "settingsOrder":["Apya.Yok.Bu.Da"],
             "items":{"Apya.YokBoyleGrup":["Apya.Dashboard"]}}
            """);

        var html = await GetResponseAsStringAsync("/Settings");

        SidebarUrls(html).ShouldContain("/Dashboard");
        SettingsLinkUrls(html).ShouldContain("/TenantManagement/Tenants");
    }

    /// <summary>Yaprağın altına öğe yerleştirilemez — düğüm varsayılan yerinde kalır.</summary>
    [Fact]
    public async Task Yapragin_altina_yerlestirme_yok_sayilir()
    {
        await SetLayoutAsync("""{"items":{"Apya.Dashboard":["Apya.Reports.Overview"]}}""");

        var sidebar = SidebarUrls(await GetResponseAsStringAsync("/Settings"));

        sidebar.ShouldContain("/Dashboard");
        sidebar.ShouldContain("/Reports");
    }

    /// <summary>Döngüsel yerleşim menüyü kilitlememeli; düğümler varsayılana döner.</summary>
    [Fact]
    public async Task Dongusel_duzen_menuyu_cokertmez()
    {
        await SetLayoutAsync("""
            {"items":{"Apya.Work":["Apya.Content"],"Apya.Content":["Apya.Work"]}}
            """);

        var sidebar = SidebarUrls(await GetResponseAsStringAsync("/Settings"));

        sidebar.ShouldContain("/Projects");
        sidebar.ShouldContain("/Documents");
    }

    /// <summary>
    /// Dip bloktaki ipucu artık sabit değil; kullanıcının GERÇEKTEN gördüğü
    /// hedeflerden üretilir (ApyaThemeHead → #ApyaShellNav).
    /// </summary>
    [Fact]
    public async Task Dip_blok_ipucu_gercek_listeden_uretilir()
    {
        await SetLayoutAsync("""{"items":{"Apya.Management":["Apya.Admin.Tenants"]}}""");

        var html = await GetResponseAsStringAsync("/Settings");
        var block = Parse(html).DocumentNode.SelectSingleNode("//script[@id='ApyaShellNav']");

        block.ShouldNotBeNull();
        // Kenar çubuğuna alınan hedef ipucunda YER ALMAZ.
        block.InnerText.ShouldNotContain("Kiracı Yönetimi");
        block.InnerText.ShouldContain("settingsHint");
    }
}
