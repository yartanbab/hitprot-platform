using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /PackageManagement — paket süresi bölümü.
///
/// <para>Bölüm saf JS ile doldurulur (<c>getSubscriptionSettings</c>); testin ölçtüğü şey
/// JS'in tutunacağı KİMLİKLERİN gerçekten basıldığıdır. Bir id yeniden adlandırılırsa
/// sayfa sessizce çalışmaya devam eder ama ayarlar hiç yüklenmez/kaydedilmez —
/// bu, ekranda hata vermeyen bir bozulmadır.</para>
/// </summary>
public class SubscriptionSettingsPage_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    [Fact]
    public async Task Sure_ayarlari_bolumu_JS_kancalariyla_basilir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/PackageManagement"));

        foreach (var id in new[] { "SubAutoDowngrade", "SubGraceDays", "SubWarningDays", "SubSaveBtn" })
        {
            doc.DocumentNode
                .SelectSingleNode($"//*[@id='{id}']")
                .ShouldNotBeNull($"'{id}' öğesi basılmadı; süre ayarları JS'i buna bağlı");
        }
    }

    /// <summary>
    /// Yükseltme kanalı alanları da aynı JS bloğuna bağlıdır. Kimlik değişirse host
    /// alanları doldurur, "Kaydet" der ve hiçbir şey kaydedilmez — kiracı tarafındaki
    /// yükseltme düğmeleri de sessizce hiç görünmez.
    /// </summary>
    [Fact]
    public async Task Yukseltme_kanali_alanlari_JS_kancalariyla_basilir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/PackageManagement"));

        foreach (var id in new[] { "SubUpgradeEmail", "SubUpgradePhone", "SubUpgradeUrl" })
        {
            doc.DocumentNode
                .SelectSingleNode($"//*[@id='{id}']")
                .ShouldNotBeNull($"'{id}' öğesi basılmadı; yükseltme kanalı JS'i buna bağlı");
        }
    }

    /// <summary>
    /// ADM-11: kayıt ucu TAM güncellemedir. Ayarlar yüklenemezse boş form kaydedilip tüm
    /// süre/yükseltme/bedel ayarlarını ezerdi. Kilit JS'e bırakılmaz, markup'ın varsayılanıdır:
    /// JS hiç çalışmasa da Kaydet kapalı. Tekrar dene kutusu kilidin DIŞINDA olmalı, yoksa
    /// yükleme hatasında düğme de kilitlenir ve sayfa bir daha açılamaz.
    /// </summary>
    [Fact]
    public async Task Sure_ayarlari_formu_yuklenene_kadar_kilitli_basilir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/PackageManagement"));

        var form = doc.DocumentNode.SelectSingleNode("//fieldset[@id='SubSettingsForm']");
        form.ShouldNotBeNull("Süre ayarları formu kilitlenebilir bir fieldset içinde basılmadı");
        form!.Attributes.Contains("disabled").ShouldBeTrue("Form yüklenmeden kilitli basılmalı");

        foreach (var id in new[]
                 {
                     "SubSaveBtn", "SubAutoDowngrade", "SubGraceDays", "SubWarningDays",
                     "SubUpgradeEmail", "SubUpgradePhone", "SubUpgradeUrl",
                     "PriceStandard", "PriceCorporate", "PriceJoint"
                 })
        {
            doc.DocumentNode
                .SelectSingleNode($"//fieldset[@id='SubSettingsForm']//*[@id='{id}']")
                .ShouldNotBeNull($"'{id}' kilitli formun dışında kaldı; ayarlar yüklenmeden düzenlenebilir");
        }

        doc.DocumentNode.SelectSingleNode("//*[@id='SubLoadState']")
            .ShouldNotBeNull("Yükleme hatası kutusu (#SubLoadState) basılmadı");
        doc.DocumentNode.SelectSingleNode("//fieldset[@id='SubSettingsForm']//*[@id='SubLoadState']")
            .ShouldBeNull("#SubLoadState kilitli formun içinde; Tekrar dene düğmesi de kilitlenir");
    }

    /// <summary>
    /// Ek süre alanı sunucuda 0–90'a clamp'lenir; girdi de aynı aralığı göstermeli ki
    /// kullanıcı 365 yazıp sessizce 90'a düşürülmesin.
    /// </summary>
    [Fact]
    public async Task Ek_sure_alani_sunucudaki_araligi_yansitir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/PackageManagement"));

        var input = doc.DocumentNode.SelectSingleNode("//input[@id='SubGraceDays']");
        input.ShouldNotBeNull();
        input!.GetAttributeValue("type", "").ShouldBe("number");
        input.GetAttributeValue("min", "").ShouldBe("0");
        input.GetAttributeValue("max", "").ShouldBe("90");
    }

    /// <summary>
    /// Yeni müşteri formunda süre seçicisi enum ADIYLA basılmalı: değerler sayıya
    /// dönerse enum sırası değiştiğinde form sessizce yanlış dönemi gönderir.
    /// </summary>
    [Fact]
    public async Task Yeni_musteri_formunda_sure_secicisi_vardir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/TenantManagement/Tenants/CreateModal"));

        var select = doc.DocumentNode.SelectSingleNode("//select[@id='Tenant_SubscriptionPeriod']");
        select.ShouldNotBeNull("Paket süresi seçicisi basılmadı");

        var options = select!.SelectNodes(".//option");
        options.Count.ShouldBe(5);
        options[0].GetAttributeValue("value", "").ShouldBe("Unlimited");

        // InnerText ham HTML'dir ("S&#xFC;resiz"); etiketi karşılaştırmadan önce çöz.
        HtmlEntity.DeEntitize(options[0].InnerText).Trim().ShouldBe("Süresiz");
    }
}
