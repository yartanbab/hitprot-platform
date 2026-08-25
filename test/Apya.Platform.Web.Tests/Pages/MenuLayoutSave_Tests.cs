using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.SettingManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Menü düzeninin KAYDETME yolu — /Settings/Menu POST'u.
///
/// Neden ayrı bir dosya: mevcut MenuLayoutPage_Tests düzeni doğrudan
/// <see cref="ISettingManager"/> ile yazıp yalnız OKUMA yolunu (resolver)
/// doğruluyor. OnPostAsync — yani "tarayıcının ürettiği JSON → MenuLayout.Parse
/// → Serialize → ayara yaz" zinciri — hiç çalıştırılmıyordu. Düzen ekranında
/// yapılan bir değişikliğin gerçekten kalıcı olup olmadığı bu boşlukta kalıyordu.
/// </summary>
public class MenuLayoutSave_Tests : PlatformWebTestBase
{
    private const string MenuUrl = "/Settings/Menu";

    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>Kenar çubuğu menüsündeki bağlantı adresleri (sıralı).</summary>
    private static string[] SidebarUrls(string html)
    {
        var menu = Parse(html).DocumentNode
            .SelectSingleNode("//ul[contains(@class,'lpx-nav-menu')]");

        return menu?.SelectNodes(".//a[@href]")
                   ?.Select(a => a.GetAttributeValue("href", ""))
                   .ToArray()
               ?? Array.Empty<string>();
    }

    /// <summary>
    /// Razor'un bastığı antiforgery jetonu. Jeton olmadan POST 400 döner ve
    /// test "kaydetmedi" diye YANLIŞ bir kusur raporlar.
    /// </summary>
    private static string AntiforgeryToken(string html)
    {
        var input = Parse(html).DocumentNode
            .SelectSingleNode("//input[@name='__RequestVerificationToken']");

        input.ShouldNotBeNull("Sayfada antiforgery jetonu yok — POST kurulamaz.");
        return input.GetAttributeValue("value", "");
    }

    private async Task<HttpResponseMessage> PostLayoutAsync(string layoutJson)
    {
        var token = AntiforgeryToken(await GetResponseAsStringAsync(MenuUrl));

        return await Client.PostAsync(MenuUrl, new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                ["LayoutJson"] = layoutJson,
                ["__RequestVerificationToken"] = token
            }));
    }

    // ── Kaydetme gerçekten kalıcı mı? ────────────────────────────────────────

    /// <summary>
    /// Bir grubun ÇOCUK sırası değiştirilip kaydedilince, sonraki istekte
    /// kenar çubuğuna yansımalı.
    ///
    /// Bu senaryo tarayıcıda elle denendiğinde şüpheli görünmüştü: kaydetten
    /// sonra taze istekte eski sıra geliyordu ve AbpSettings'te satır yoktu.
    /// Sentetik tıklamanın POST'u hiç göndermemiş olabileceği ayırt edilemedi;
    /// bu test aynı soruyu deterministik olarak cevaplıyor.
    /// </summary>
    [Fact]
    public async Task Kaydedilen_grup_ici_sira_sonraki_istekte_gecerli()
    {
        var once = SidebarUrls(await GetResponseAsStringAsync("/Settings"));
        Array.IndexOf(once, "/Documents").ShouldBeGreaterThan(-1);
        Array.IndexOf(once, "/DynamicAssets").ShouldBeGreaterThan(-1);
        // Varsayılan: Dokümanlar önce.
        Array.IndexOf(once, "/Documents")
             .ShouldBeLessThan(Array.IndexOf(once, "/DynamicAssets"));

        var response = await PostLayoutAsync("""
            {"items":{"Apya.Content":["Apya.Content.DynamicAssets","Apya.Content.Documents"]}}
            """);
        // Başarılı kayıt RedirectToPage ile döner. Test istemcisi yönlendirmeyi
        // İZLEMEZ; 200 beklemek testi kendi hatasıyla düşürür. 302 dışında bir
        // değer (ör. 200 = sayfa hatayla yeniden basıldı) kaydın YAPILMADIĞINI
        // gösterir, bu yüzden burada kesin eşitlik aranıyor.
        response.StatusCode.ShouldBe(HttpStatusCode.Found);

        var sonra = SidebarUrls(await GetResponseAsStringAsync("/Settings"));
        Array.IndexOf(sonra, "/DynamicAssets")
             .ShouldBeLessThan(Array.IndexOf(sonra, "/Documents"));
    }

    /// <summary>
    /// Kaydetme AYARA yazmalı. Yukarıdaki test yalnız sonucu görür; bu test
    /// verinin gerçekten kalıcı depoya indiğini ve düzenin geri okunabildiğini
    /// ayrıca doğrular (ekranda "kaydedildi" yazıp hiçbir şey yazmama vakası).
    /// </summary>
    [Fact]
    public async Task Kaydetme_ayari_gercekten_yazar()
    {
        await PostLayoutAsync("""
            {"items":{"Apya.Content":["Apya.Content.DynamicAssets","Apya.Content.Documents"]}}
            """);

        var kayitli = await GetRequiredService<ISettingManager>()
            .GetOrNullForCurrentUserAsync(PlatformSettings.Shell.MenuLayout);

        kayitli.ShouldNotBeNullOrWhiteSpace();
        kayitli.ShouldContain("Apya.Content.DynamicAssets");
    }

    /// <summary>
    /// Çözülemeyen yük kayıtlı düzeni SİLMEMELİ. Parse bozuk JSON'u boş düzene
    /// düşürüyor; bu "kullanıcı her şeyi boşalttı" sanılıp kaydedilirse mevcut
    /// düzen sessizce kaybolur ve ekranda yine "kaydedildi" yazar.
    /// </summary>
    [Fact]
    public async Task Bozuk_yuk_kayitli_duzeni_silmez()
    {
        await PostLayoutAsync("""
            {"items":{"Apya.Content":["Apya.Content.DynamicAssets","Apya.Content.Documents"]}}
            """);

        await PostLayoutAsync("{ bu gecerli bir json degil ");

        var kayitli = await GetRequiredService<ISettingManager>()
            .GetOrNullForCurrentUserAsync(PlatformSettings.Shell.MenuLayout);

        kayitli.ShouldNotBeNullOrWhiteSpace();
        kayitli.ShouldContain("Apya.Content.DynamicAssets");
    }

    // ── Geri bildirim görünüyor mu? ──────────────────────────────────────────

    /// <summary>
    /// Çözülemeyen yükte kullanıcı hatayı GÖRMELİ.
    ///
    /// Handler ModelState'e MenuLayout:SaveFailed ekliyordu ama sayfa hiçbir
    /// doğrulama özeti basmıyordu: kullanıcı ne yeşil ne kırmızı, sıfır geri
    /// bildirim alıyor ve düzeninin kaydedilmediğini fark etmiyordu. Üstelik bu
    /// yolda RedirectToPage yok, yani "kaydedildi" kutusu da çıkmaz — ekran
    /// tamamen sessiz kalıyordu.
    /// </summary>
    [Fact]
    public async Task Cozulemeyen_yukte_hata_ekranda_gorunur()
    {
        var response = await PostLayoutAsync("{ bu gecerli bir json degil ");

        // Hata yolu Page() döner — 302 DEĞİL. 302 görürsek kaydedilmiş demektir.
        response.StatusCode.ShouldBe(HttpStatusCode.OK);

        var html = await response.Content.ReadAsStringAsync();
        html.ShouldContain("kaydedilemedi");
    }

    /// <summary>
    /// Başarı kutusunun kimliği Menu.js'in onu görünür alana kaydırması için
    /// şart. Kimlik düşerse kaydırma sessizce ölür ve kullanıcı yine kaydettiği
    /// yerde hiçbir şey görmez — "bir daha bas" davranışı geri döner.
    /// </summary>
    [Fact]
    public async Task Kaydedildi_kutusu_kaydirilabilir_kimlik_tasir()
    {
        await PostLayoutAsync("""
            {"items":{"Apya.Content":["Apya.Content.DynamicAssets","Apya.Content.Documents"]}}
            """);

        var html = await GetResponseAsStringAsync(MenuUrl);

        html.ShouldContain("id=\"ApyaNavSaved\"");
    }
}
