using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Yönetim ekranlarının YÜKLEME HATASI sözleşmesi (ADM-11, ADM-17).
///
/// <para>Paket Yönetimi ve Sistem Sağlığı betikleri $(fn), bootstrap.Modal, ABP proxy'leri
/// ve $.get kullandığı için vitest'te koşulamıyor; sözleşme kaynaktan kilitlenir. Yardımcının
/// kendisi <c>apyaLoadState.test.js</c> ve <c>apyaLatest.test.js</c>'te davranışsal test ediliyor.</para>
///
/// <para>Bozulma ekranda hata vermez: süre formu yüklenmeden açılırsa boş form kaydedilip tüm
/// host ayarlarını ezer; teşhis paneli yalnız başarıda değişirse seçili satır ile panel ayrışır
/// ve "Çözüldü" ESKİ olaya yazar; yardımcı demetten düşerse teşhis konsolunda satır tıklaması
/// TypeError atar, paket ekranında hata yolu çöker.</para>
/// </summary>
public class AdminLoadFailureScripts_Tests
{
    private static string ReadSource(params string[] relative)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynaklar depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, Path.Combine(relative));

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        // Çalışma ağacı CRLF (autocrlf); satır eşleşmeleri LF üzerinden yapılır.
        return File.ReadAllText(path).Replace("\r\n", "\n");
    }

    private static string PackageScript() =>
        ReadSource("src", "Apya.Platform.Web", "Pages", "PackageManagement", "Index.js");

    private static string HealthScript() =>
        ReadSource("src", "Apya.Platform.Web", "Pages", "Admin", "SystemHealth", "Index.js");

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

    // ─────────────────────────── ADM-11: Paket Yönetimi ───────────────────────────

    [Fact]
    public void Paket_kartlari_hata_dalli_ve_son_istek_korumali_yuklenir()
    {
        var script = PackageScript();

        script.ShouldNotContain("svc.getList().then(render);");

        var load = Body(script, "function load()");
        load.ShouldContain("nextCards()");
        Count(load, "if (!isLatest())").ShouldBe(2, "başarı ve hata dalı ikisi de bayat yanıtı yutmalı");
        load.ShouldContain("js-pkg-retry");

        script.ShouldContain(".on('click', '.js-pkg-retry'");
    }

    /// <summary>
    /// Kayıt ucu TAM güncellemedir: form yalnız son başarılı yüklemenin değerleri yazıldıktan
    /// SONRA açılır. Kilit istek BAŞINDA konur (kayıt sonrası yeniden yükleme sürerken girilen
    /// değer geç yanıtla ezilmesin); hata dalı kilidi açmaz, Tekrar dene basar.
    /// </summary>
    [Fact]
    public void Sure_ayarlari_formu_yalniz_son_basarili_yuklemeden_sonra_acilir()
    {
        var script = PackageScript();
        const string unlock = "$('#SubSettingsForm').prop('disabled', false)";

        Count(script, unlock).ShouldBe(1, "form kilidini yalnız yükleme başarısı açmalı");

        var body = Body(script, "function loadSubscriptionSettings()");
        ShouldAppearInOrder(body,
            "$('#SubSettingsForm').prop('disabled', true)",
            "nextSub()",
            "getSubscriptionSettings()",
            "setPrice('#PriceJoint'",
            unlock,
            "js-sub-retry");
        Count(body, "if (!isLatest())").ShouldBe(2, "başarı ve hata dalı ikisi de bayat yanıtı yutmalı");

        script.ShouldContain(".on('click', '.js-sub-retry'");
    }

    // ─────────────────────────── ADM-17: Sistem Sağlığı teşhis konsolu ───────────────────────────

    /// <summary>
    /// $.get ham jQuery'dir: abp.ajax'ın hata yolu hiç çalışmaz, hata dalı yoksa kullanıcı hiçbir
    /// şey görmez. Her $.get ya son-istek bekçisiyle iki dallı Promise'e sarılır ya da .fail taşır.
    /// </summary>
    [Fact]
    public void Teshis_konsolunda_hata_dalsiz_get_kalmaz()
    {
        var script = HealthScript();
        const string wrapped = "Promise.resolve(";

        var matches = Regex.Matches(script, Regex.Escape("$.get(")).Cast<Match>().ToList();
        matches.ShouldNotBeEmpty();

        foreach (var m in matches)
        {
            var line = script.Take(m.Index).Count(c => c == '\n') + 1;
            var window = string.Join("\n", script.Substring(m.Index).Split('\n').Take(16));

            var isWrapped = m.Index >= wrapped.Length
                            && script.Substring(m.Index - wrapped.Length, wrapped.Length) == wrapped;

            if (isWrapped)
            {
                window.ShouldContain("}, function", Case.Sensitive,
                    $"{line}. satırdaki $.get Promise'e sarılmış ama reddetme dalı yok");
            }
            else
            {
                window.ShouldContain(".fail(", Case.Sensitive,
                    $"{line}. satırdaki $.get hata dalı taşımıyor");
            }
        }
    }

    [Fact]
    public void Teshis_paneli_istek_basinda_temizlenir_ve_yeniden_denenebilir()
    {
        var script = HealthScript();

        script.ShouldNotContain("reloadList().done(");
        script.ShouldContain(".on('click', '.js-issue-detail-retry'");
        script.ShouldContain(".on('click', '.js-issue-list-retry'");

        // Seçim değişir değişmez eski kanıt (ve Kopyala/Çözüldü düğmeleri) panelden kalkar.
        var fetch = Body(script, "function fetchDetail(");
        ShouldAppearInOrder(fetch, "nextDetail()", "loadingHtml(", "Promise.resolve($.get(", "errorHtml(");
        Count(fetch, "if (!isLatest())").ShouldBe(2);

        Body(script, "function loadDetail(").ShouldContain("fetchDetail(");

        var list = Body(script, "function reloadList(");
        list.ShouldContain("nextList()");
        list.ShouldContain("errorHtml(");
        Count(list, "if (!isLatest())").ShouldBe(2);
    }

    // ─────────────────────────── Ortak yardımcı ───────────────────────────

    /// <summary>
    /// <c>apya.loadState</c> yükleme/hata dallarında kullanılıyor (betik başında yalnız
    /// <c>apya.latest()</c> çağrılır). Kayıt unutulursa teşhis konsolunda satır tıklaması TypeError
    /// atar ve seçim ile panel yeniden ayrışır (ADM-17 geri döner); paket ekranında hata yolu
    /// çöker. Depoda demet kaydını ölçen başka test yok.
    /// </summary>
    [Fact]
    public void Yardimci_global_demette_apya_latest_altinda_kayitli()
    {
        var module = ReadSource("src", "Apya.Platform.Web", "PlatformWebModule.cs");

        var global = module.IndexOf("LeptonXLiteThemeBundles.Scripts.Global", StringComparison.Ordinal);
        var latest = module.IndexOf("\"/js/apya-latest.js\"", StringComparison.Ordinal);
        var loadState = module.IndexOf("bundle.AddFiles(\"/js/apya-load-state.js\")", StringComparison.Ordinal);

        global.ShouldBeGreaterThanOrEqualTo(0);
        latest.ShouldBeGreaterThanOrEqualTo(0);
        loadState.ShouldBeGreaterThan(global, "apya-load-state.js global demette kayıtlı olmalı.");
        loadState.ShouldBeGreaterThan(latest, "apya-load-state.js, apya-latest.js'in altına kaydedilmeli.");

        ReadSource("src", "Apya.Platform.Web", "wwwroot", "js", "apya-load-state.js")
            .ShouldContain("window.apya.loadState =");
    }
}
