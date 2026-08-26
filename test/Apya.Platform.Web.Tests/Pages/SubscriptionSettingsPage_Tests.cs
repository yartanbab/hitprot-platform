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
