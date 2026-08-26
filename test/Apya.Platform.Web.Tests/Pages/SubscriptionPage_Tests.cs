using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Web.Menus;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /Subscription — kiracının "Paketim" ekranı.
///
/// <para>Web testleri HOST bağlamında koşar; buradaki ölçüm bu yüzden iki şeye bakar:
/// sayfanın host'ta patlamadan açılması ve host'a paket yerine bilgi notu göstermesi.
/// Kiracı gözüyle içerik doğrulaması app service testlerindedir
/// (<c>MySubscription_Tests</c>).</para>
/// </summary>
public class SubscriptionPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Paketim_ekrani_host_baglaminda_paket_yerine_bilgi_notu_gosterir()
    {
        // Razor Türkçe harfleri HTML varlığı olarak basar ("hesab&#x131;nda") — karşılaştırmadan
        // önce çöz, yoksa doğru metin bulunamamış gibi görünür.
        var html = HtmlEntity.DeEntitize(await GetResponseAsStringAsync("/Subscription"));

        // Host'un paketi yoktur; geri sayım/kota basmak yanlış bilgi olurdu.
        html.ShouldContain("Host hesabında paket");
    }

    /// <summary>
    /// Süre bildirimlerinin gideceği yer bu sayfadır. Şablon boşalırsa bildirim
    /// tıklanamaz hâle döner ve kullanıcı "yenileyin" denip nereye gideceğini bilemez —
    /// özelliğin ilk hâlindeki eksik tam da buydu.
    /// </summary>
    [Fact]
    public void Sure_bildirimleri_Paketim_ekranina_baglanir()
    {
        NotificationTypeRegistry.Get(NotificationType.SubscriptionExpiring)
            .DeepLinkTemplate.ShouldBe("/Subscription");

        NotificationTypeRegistry.Get(NotificationType.SubscriptionDowngraded)
            .DeepLinkTemplate.ShouldBe("/Subscription");
    }

    /// <summary>
    /// Katalog kaydı ile sayfanın adresi ayrışırsa Ayarlar'daki bağlantı 404'e gider.
    /// Kayıt ayrıca kiracıya özeldir: host'ta basılmamalı.
    /// </summary>
    [Fact]
    public void Paketim_baglantisi_katalogda_kiraciya_ozel_tanimlidir()
    {
        var link = PlatformAdminLinks.All.Single(x => x.Name == "Apya.Admin.Subscription");

        link.Url.ShouldBe("/Subscription");
        link.TenantOnly.ShouldBeTrue();
    }
}
