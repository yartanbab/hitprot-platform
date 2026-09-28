using System;
using System.IO;
using System.Text.Json;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /Grants kiracı ekranındaki kurum profili editörünün YÜKLEME sözleşmesi (ADM-11 ile aynı kök).
///
/// <para>Kayıt ucu (UpdateMyProfileAsync) profili ve etiketleri TAM değiştirir; boş liste "hepsini
/// kaldır" demektir (sunucu tarafı <c>FirmProfileTags_Tests</c>'te kilitli). Eskiden form, profil
/// okunmadan da açık ve kaydedilebilirdi: akış ya da profil okuması düşünce boş form kaydedilip
/// profil ve tüm etiketler siliniyordu. Tenant.js $(fn), bootstrap.Modal ve ABP proxy'leri
/// kullandığı için vitest'te koşulamıyor; sözleşme kaynaktan kilitlenir.</para>
/// </summary>
public class GrantFirmProfileEditorScript_Tests
{
    private static string ReadSource(params string[] relative)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynaklar depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, Path.Combine(relative));

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        // Çalışma ağacı CRLF (autocrlf); eşleşmeler LF üzerinden yapılır.
        return File.ReadAllText(path).Replace("\r\n", "\n");
    }

    private static string Script() =>
        ReadSource("src", "Apya.Platform.Web", "Pages", "Grants", "Tenant.js");

    private static string Markup() =>
        ReadSource("src", "Apya.Platform.Web", "Pages", "Grants", "Index.cshtml");

    /// <summary>4 boşluk girintili fonksiyon bildiriminin gövdesi (kapanan '    }' satırına kadar).</summary>
    private static string Body(string source, string declaration)
    {
        var from = source.IndexOf(declaration, StringComparison.Ordinal);
        from.ShouldBeGreaterThanOrEqualTo(0, $"'{declaration}' bulunamadı.");
        var to = source.IndexOf("\n    }\n", from, StringComparison.Ordinal);
        to.ShouldBeGreaterThan(from, $"'{declaration}' gövdesinin sonu bulunamadı.");
        return source.Substring(from, to - from);
    }

    private static void ShouldAppearInOrder(string text, params string[] parts)
    {
        var at = 0;
        foreach (var part in parts)
        {
            var next = text.IndexOf(part, at, StringComparison.Ordinal);
            next.ShouldBeGreaterThanOrEqualTo(0, $"'{part}' beklenen sırada bulunamadı.");
            at = next + part.Length;
        }
    }

    private static int Count(string text, string part) =>
        Regex.Matches(text, Regex.Escape(part)).Count;

    /// <summary>
    /// JS hiç çalışmasa da Kaydet kapalı: form ve düğme markup'ta kilitli basılır. Tekrar dene
    /// kutusu fieldset'in DIŞINDA — içeride olsaydı kendi düğmesi de kilitlenirdi.
    /// </summary>
    [Fact]
    public void Profil_formu_ve_Kaydet_markupta_kilitli_basilir()
    {
        var markup = Markup();

        ShouldAppearInOrder(markup,
            "id=\"ProfileEditor\"",
            "<div id=\"ProfileLoadState\"></div>",
            "<fieldset id=\"ProfileForm\" class=\"d-flex flex-column gap-3\" disabled>",
            "id=\"ProfileOrgType\"",
            "class=\"apya-tag-input\" data-kind=\"2\"",
            "id=\"SaveProfileBtn\"",
            "</fieldset>");
        Count(markup, "<fieldset id=\"ProfileForm\"").ShouldBe(1);
    }

    /// <summary>
    /// Kilit istek BAŞINDA konur (kayıt sonrası yeniden yükleme sürerken girilen değer geç yanıtla
    /// ezilmesin), yalnız son isteğin başarılı profil okuması değerler yazıldıktan SONRA açar.
    /// Akış düşse de profil okunur; iki aşamanın da hata dalı Tekrar dene basar.
    /// </summary>
    [Fact]
    public void Profil_formu_yalniz_son_basarili_profil_okumasindan_sonra_acilir()
    {
        var script = Script();
        const string unlock = "$('#ProfileForm').prop('disabled', false)";

        // Eski zincir: hata dalı yok, yanıt bekçisiz boyanıyordu.
        script.ShouldNotContain("}).then(paintProfile);");
        script.ShouldNotContain("return profileSvc.getMyProfile();");

        Count(script, unlock).ShouldBe(1, "form kilidini yalnız profil okuması açmalı");

        var load = Body(script, "function load()");
        ShouldAppearInOrder(load,
            "nextLoad()",
            "$('#ProfileForm').prop('disabled', true)",
            "loadFeed().then(function () {",
            "if (!isLatest())",
            "Promise.resolve(profileSvc.getMyProfile())",
            "paintProfile(p)",
            unlock,
            "}, function () {",
            "profile = null;",
            "js-grants-load-retry");
        Count(load, "if (!isLatest())").ShouldBe(3, "profil adımının başarı ve hata dalları ile ara adım bayat yanıtı yutmalı");

        // Yükleniyor kutusu yalnız profil henüz boyanmamışken: kayıt sonrası yeniden yükleme açık
        // editörü büyük blokla aşağı itmez; kilit yine her yüklemede konur.
        ShouldAppearInOrder(load, "if (!profile) {", "apya.loadState.loadingHtml(");

        script.ShouldContain("var nextLoad = apya.latest();");
        script.ShouldContain(".on('click', '.js-grants-load-retry'");
    }

    /// <summary>
    /// Akışın Tekrar dene'si yalnız akışı yeniden yükler, kendi biletiyle. Eskiden profil kutusuyla
    /// aynı load()'u çağırıyordu: form kilitlenip paintProfile sunucu değerlerini yeniden basıyor,
    /// açık editördeki kaydedilmemiş alanlar ve çipler uyarısız siliniyordu.
    /// </summary>
    [Fact]
    public void Akisin_Tekrar_denesi_profil_formuna_dokunmaz()
    {
        var script = Script();

        var feed = Body(script, "function loadFeed()");
        ShouldAppearInOrder(feed,
            "nextFeed()",
            "Promise.resolve(recoSvc.getOpenCalls())",
            "paintGain();",
            "}, function () {",
            "js-grants-feed-retry");
        Count(feed, "if (!isLatest())").ShouldBe(2);
        feed.ShouldNotContain("#ProfileForm");
        feed.ShouldNotContain("#ProfileLoadState");
        feed.ShouldNotContain("paintProfile");
        feed.ShouldNotContain("js-grants-load-retry");

        script.ShouldContain("var nextFeed = apya.latest();");
        script.ShouldContain(
            "$('#FeedGrid').on('click', '.js-grants-feed-retry', function () {\n" +
            "        $(this).prop('disabled', true);\n" +
            "        loadFeed();\n" +
            "    });");
    }

    /// <summary>Akış yüklenemediyse sekme değişimi hata kutusunu "uygun çağrı yok" ile ezmez.</summary>
    [Fact]
    public void Akis_hatasi_sekme_degisiminde_ezilmez()
    {
        var script = Script();

        Body(script, "function paintFeed()").ShouldContain("if (feedFailed) { return; }");
        Body(script, "function loadFeed()").ShouldContain("feedFailed = true;");
    }

    /// <summary>
    /// Yükleme ve hata kutularının başlıkları tr/en kaynaklarından gelir. Gövde ve düğme zaten
    /// apya.loadState'te Common:FetchError / Common:Retry'dan geliyordu; gömülü Türkçe başlık
    /// İngilizce kiracıya Türkçe başlıklı, İngilizce gövdeli karışık kutu basıyordu.
    /// </summary>
    [Fact]
    public void Yukleme_ve_hata_kutusu_basliklari_yerellestirilir()
    {
        var script = Script();
        var keys = new[] { "Grants:Feed:Profile:Loading", "Grants:Feed:Profile:LoadFailed", "Grants:Feed:LoadFailed" };

        script.ShouldNotContain("'Kurum profili yükleniyor…'");
        script.ShouldNotContain("'Kurum profili yüklenemedi.'");
        script.ShouldNotContain("'Hibe çağrıları yüklenemedi.'");

        var load = Body(script, "function load()");
        load.ShouldContain("apya.loadState.loadingHtml(l('Grants:Feed:Profile:Loading'))");
        load.ShouldContain("apya.loadState.errorHtml(l('Grants:Feed:Profile:LoadFailed'), 'js-grants-load-retry')");
        Body(script, "function loadFeed()")
            .ShouldContain("apya.loadState.errorHtml(l('Grants:Feed:LoadFailed'), 'js-grants-feed-retry')");

        foreach (var culture in new[] { "tr", "en" })
        {
            using var json = JsonDocument.Parse(ReadSource(
                "src", "Apya.Platform.Domain.Shared", "Localization", "Platform", culture + ".json"));
            var texts = json.RootElement.GetProperty("texts");
            foreach (var key in keys)
            {
                texts.TryGetProperty(key, out var value)
                    .ShouldBeTrue($"{key} anahtarı {culture}.json'da yok; ekranda ham anahtar görünür.");
                value.GetString().ShouldNotBeNullOrWhiteSpace();
            }
        }
    }
}
