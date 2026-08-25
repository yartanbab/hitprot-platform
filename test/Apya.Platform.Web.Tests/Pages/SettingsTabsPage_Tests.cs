using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /Settings — sekmeli düzen.
///
/// Test host'u AddAlwaysAllowAuthorization kullanır: bütün sekmeler render olur,
/// bu yüzden buradaki iddialar YAPI hakkındadır, izin kapısı hakkında değil.
/// (İzne göre dallanan davranış bu suite'te ölçülemez — kimlik doğrulanmamış bir
/// asıl ile tüm izinler açık gelir.)
/// </summary>
public class SettingsTabsPage_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    private static HtmlNode? Pane(HtmlDocument doc, string id)
    {
        return doc.DocumentNode.SelectSingleNode($"//div[@id='{id}' and contains(@class,'tab-pane')]");
    }

    [Fact]
    public async Task Sekmeler_ve_panelleri_basilir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Settings"));

        foreach (var id in new[] { "st-tasks", "st-projects", "st-mobile", "st-menu", "st-tenant", "st-admin" })
        {
            Pane(doc, id).ShouldNotBeNull($"'{id}' paneli basılmadı");
            doc.DocumentNode
                .SelectSingleNode($"//button[@data-bs-target='#{id}']")
                .ShouldNotBeNull($"'{id}' sekme düğmesi basılmadı");
        }
    }

    /// <summary>
    /// Bootstrap gizlemeyi `.tab-content > .tab-pane` DOĞRUDAN ÇOCUK seçicisiyle
    /// yapar. Form panellerle .tab-content arasına girerse hiçbir panel gizlenmez
    /// ve altı sekmenin içeriği alt alta basılır — sayfa sessizce eski hâline döner.
    /// </summary>
    [Fact]
    public async Task Form_tab_contenti_SARAR_araya_girmez()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Settings"));

        var content = doc.DocumentNode.SelectSingleNode("//div[@id='SettingsTabContent']");
        content.ShouldNotBeNull();
        content.ParentNode.Name.ShouldBe("form");

        // Paneller de .tab-content'in DOĞRUDAN çocuğu olmalı.
        Pane(doc, "st-mobile")!.ParentNode.Id.ShouldBe("SettingsTabContent");
    }

    /// <summary>
    /// İşaretsiz onay kutusu POST'ta HİÇ görünmez; bağlı özellik varsayılanıyla
    /// başlatıldığı için sunucu "kullanıcı kapattı"yı göremez. Varsayılanı TRUE
    /// olan `TaskCreateShowKeyboardHints` bu yüzden bir daha kapanmıyordu, üstelik
    /// başka bir sekmeden yapılan her kayıt onu sessizce geri açıyordu.
    /// Gizli "false" eşlikçisi tek çözüm — üç kutuda da bulunmalı.
    /// </summary>
    [Theory]
    [InlineData("TaskCreateShowKeyboardHints")]
    [InlineData("ProjectsDetailPanel")]
    [InlineData("TaskCreateShowInfoBanner")]
    public async Task Onay_kutusunun_gizli_false_eslikcisi_var(string name)
    {
        var doc = Parse(await GetResponseAsStringAsync("/Settings"));

        var inputs = doc.DocumentNode
            .SelectNodes($"//input[@name='{name}']")
            ?.Select(x => x.GetAttributeValue("type", ""))
            .ToArray();

        inputs.ShouldNotBeNull();
        inputs.ShouldContain("checkbox");
        inputs.ShouldContain("hidden");
    }

    /// <summary>
    /// Kaydet düğmesi CSS'te aktif panelin `data-needs-save` bayrağına göre
    /// gizleniyor. Bayrak yanlış panellerde olursa düğme kaydedilecek alanı olan
    /// bir sekmede kaybolur (ya da olmayanında görünür).
    /// </summary>
    [Fact]
    public async Task Kaydet_bayragi_yalniz_kaydedilecek_alani_olan_panellerde()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Settings"));

        foreach (var id in new[] { "st-tasks", "st-projects", "st-tenant" })
        {
            Pane(doc, id)!.GetAttributeValue("data-needs-save", null).ShouldBe("true", $"'{id}' kaydedilebilir olmalı");
        }

        foreach (var id in new[] { "st-mobile", "st-menu", "st-admin" })
        {
            Pane(doc, id)!.Attributes.Contains("data-needs-save").ShouldBeFalse($"'{id}' kaydedilebilir OLMAMALI");
        }
    }

    /// <summary>
    /// Sekmeli düzene geçerken "Menü Düzeni" bölümü (PR #232) kaybolmamalı: izin
    /// kapısı yok, her oturumlu kullanıcı kendi menü yerleşimini değiştirebiliyor.
    /// </summary>
    [Fact]
    public async Task Menu_duzeni_baglantisi_korunur()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Settings"));

        Pane(doc, "st-menu")!
            .SelectSingleNode(".//a[@href='/Settings/Menu']")
            .ShouldNotBeNull();
    }

    /// <summary>
    /// Sekme şeridindeki düğmeler formun İÇİNDE. `type` verilmezse tarayıcı
    /// varsayılanı submit'tir → her sekme tıklaması ayar POST'u atardı.
    /// </summary>
    [Fact]
    public async Task Sekme_dugmeleri_submit_degil()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Settings"));

        var buttons = doc.DocumentNode.SelectNodes("//ul[@id='SettingsTab']//button");
        buttons.ShouldNotBeNull();
        buttons.ShouldAllBe(b => b.GetAttributeValue("type", "") == "button");
    }
}
