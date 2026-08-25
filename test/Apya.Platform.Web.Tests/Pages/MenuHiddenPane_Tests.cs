using System.Threading.Tasks;
using Apya.Platform.Settings;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.SettingManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Gizlenenler bölmesinin DÜZENLEME EKRANINDAKİ hâli.
///
/// Bu ekran yalnız bir liste değil, tarayıcının düzeni yeniden kurduğu KAYNAK:
/// Menu.js yükü DOM'dan üretiyor. Ekranda eksik basılan her şey bir sonraki
/// kaydetmede AYAR'dan da silinir — o yüzden gizli bir satırın çocukları ve
/// nereden geldiği markup'ta bulunmak zorunda.
/// </summary>
public class MenuHiddenPane_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    private async Task SetLayoutAsync(string json)
    {
        await GetRequiredService<ISettingManager>()
            .SetGlobalAsync(PlatformSettings.Shell.MenuLayout, json);
    }

    /// <summary>Gizlenenler bölmesindeki satır düğümü.</summary>
    private static HtmlNode? HiddenRow(string html, string name)
    {
        return Parse(html).DocumentNode.SelectSingleNode(
            $"//ul[@data-nav-root='hidden']//li[@data-nav-node='{name}']");
    }

    /// <summary>
    /// 🔴 Gizli bir GRUP çocuklarıyla basılmalı. Çocuksuz basılırsa Menu.js
    /// düzeni DOM'dan kurarken `items[grup]` anahtarını hiç yazmaz ve sonraki
    /// HERHANGİ bir kaydetme — alakasız bir sıralama değişikliği bile —
    /// çocukların o gruba ait olduğu bilgisini siler. Kullanıcı grubu geri
    /// getirdiğinde içi boştur.
    /// </summary>
    [Fact]
    public async Task Gizli_kategori_cocuklariyla_birlikte_basilir()
    {
        await SetLayoutAsync("""{"hidden":["Apya.Content"]}""");

        var html = await GetResponseAsStringAsync("/Settings/Menu");
        var row = HiddenRow(html, "Apya.Content");

        row.ShouldNotBeNull();
        // Grubun kendi alt listesi ve içindeki hedefler orada olmalı.
        row.SelectSingleNode(".//ul[@data-nav-list='Apya.Content']").ShouldNotBeNull();
        row.SelectSingleNode(".//li[@data-nav-node='Apya.Content.Documents']").ShouldNotBeNull();
    }

    /// <summary>
    /// Gizlenen kök satır nereden geldiğini taşımalı; `data-nav-from` olmadan
    /// "geri getir" her öğeyi kenar çubuğunun köküne bırakıyordu ve Ayarlar
    /// sütununa indirilmiş bir hedef her gizle/göster turunda yerini kaybediyordu.
    /// </summary>
    [Fact]
    public async Task Gizlenen_satir_donus_yerini_tasir()
    {
        await SetLayoutAsync("""{"settingsOrder":["Apya.Content"],"hidden":["Apya.Content"]}""");

        var html = await GetResponseAsStringAsync("/Settings/Menu");
        var row = HiddenRow(html, "Apya.Content");

        row.ShouldNotBeNull();
        row.GetAttributeValue("data-nav-from", "").ShouldBe("#settings");
    }

    /// <summary>
    /// Gizlenmemiş satırda dönüş yeri BOŞ kalmalı. Boş anahtar Menu.js'te zaten
    /// "yok" demek (listByKey erken null döner); dolu gelseydi normal bir satır
    /// da kendini "bir yerden geldim" sanar ve taşımalar yanlış yere düşerdi.
    /// </summary>
    [Fact]
    public async Task Gizli_olmayan_satirda_donus_yeri_bostur()
    {
        var html = await GetResponseAsStringAsync("/Settings/Menu");

        var row = Parse(html).DocumentNode.SelectSingleNode(
            "//ul[@data-nav-root='sidebar']//li[@data-nav-node='Apya.Work']");

        row.ShouldNotBeNull();
        row.GetAttributeValue("data-nav-from", "dolu").ShouldBeEmpty();
    }

    /// <summary>
    /// İkon seçeneklerinin etiketi ÇEVRİLMELİ: sınıf adının İngilizce parçasını
    /// ("shield-halved") basmak Türkçe arayüzde anlaşılmaz bir liste bırakıyordu.
    /// </summary>
    [Fact]
    public async Task Ikon_secenekleri_cevrilmis_etiket_tasir()
    {
        var html = await GetResponseAsStringAsync("/Settings/Menu");

        var option = Parse(html).DocumentNode.SelectSingleNode(
            "//select[@id='ApyaNavFormIcon']/option[@value='fa fa-shield-halved']");

        option.ShouldNotBeNull();
        option.InnerText.Trim().ShouldNotBe("shield-halved");
    }

    /// <summary>
    /// Adet tavanları ekrana taşınmalı: taşınmasaydı 11. kategori kaydedilirken
    /// sunucuda sessizce kırpılır, kullanıcı ad + ikon yazıp "kaydedildi"
    /// gördükten sonra kaybını ancak menüde fark ederdi.
    /// </summary>
    [Fact]
    public async Task Adet_tavanlari_araç_cubuguna_basilir()
    {
        var html = await GetResponseAsStringAsync("/Settings/Menu");

        var toolbar = Parse(html).DocumentNode.SelectSingleNode(
            "//div[contains(@class,'apya-navedit-toolbar')]");

        toolbar.ShouldNotBeNull();
        toolbar.GetAttributeValue("data-nav-max-group", "")
            .ShouldBe(PlatformSettingDefaults.ShellMenuLayoutCustomGroupMax.ToString());
        toolbar.GetAttributeValue("data-nav-max-link", "")
            .ShouldBe(PlatformSettingDefaults.ShellMenuLayoutCustomLinkMax.ToString());
        toolbar.GetAttributeValue("data-nav-limit-group", "").ShouldNotBeEmpty();
        toolbar.GetAttributeValue("data-nav-limit-link", "").ShouldNotBeEmpty();
    }
}
