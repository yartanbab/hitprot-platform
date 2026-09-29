using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Liste ekranlarının YÜKLEME HATASI sözleşmesi (FIN-14, ADM-16, TSK-11, RES-06 — Faz 4 G2a).
///
/// <para>DataTables tabloları ortak sarmalayıcıdan (apya-latest.js createAjax + apya-load-state.js
/// failTable) geçer; o yardımcılar <c>apyaLatest.test.js</c> ve <c>apyaLoadState.test.js</c>'te
/// davranışsal test ediliyor. Sayfa betikleri $(fn), ModalManager ve ABP proxy'leri kullandığı için
/// vitest'te koşulamıyor; sayfaya düşen kısım kaynaktan kilitlenir.</para>
///
/// <para>Bozulma ekranda hata vermez: draw işleyicisi hata yanıtını başarı sanarsa hata kartının
/// yerine "Henüz görev yok" + "Yeni Görev" ve "0 görev" sayacı basılır; elle yazılmış ajax
/// fonksiyonu geri gelirse ret DataTables'a hiç ulaşmaz, tablo "İşleniyor…"da kalır.</para>
/// </summary>
public class ListLoadFailureScripts_Tests
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

    private static string Web(params string[] relative) =>
        ReadSource(new[] { "src", "Apya.Platform.Web" }.Concat(relative).ToArray());

    /// <summary>Başlangıçtan bir sonraki bitişe kadar olan metin (işleyici gövdesi yaklaşımı).</summary>
    private static string Between(string source, string start, string end)
    {
        var from = source.IndexOf(start, StringComparison.Ordinal);
        from.ShouldBeGreaterThanOrEqualTo(0, $"'{start}' bulunamadı.");
        var to = source.IndexOf(end, from + start.Length, StringComparison.Ordinal);
        to.ShouldBeGreaterThan(from, $"'{start}' sonrasında '{end}' bulunamadı.");
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

    // ─────────────────────────── DataTables: sayfa draw işleyicileri ───────────────────────────

    [Theory]
    [InlineData("Tasks", "index.js")]
    [InlineData("Projects", "ProjectDetails.js")]
    public void Gorev_tablosu_yukleme_hatasini_bos_liste_saymaz(string folder, string file)
    {
        var script = Web("Pages", folder, file);

        var draw = Between(script, "dataTable.on('draw', function () {", "hierarchy.restore();");
        ShouldAppearInOrder(draw,
            "var failed = apya.loadState.tableFailed(dataTable);",
            "$('#console-task-count').text(failed ? '—'",
            "if (!failed)",
            "renderEmptyState(");
        Count(draw, "renderEmptyState(").ShouldBe(1, "boş durum yalnız başarılı yanıtta basılmalı");
    }

    // ─────────────────────────── ADM-16: AiCenter elle yazılmış ajax ───────────────────────────

    /// <summary>
    /// Elle yazılmış <c>ajax: function (data, callback)</c> reddi DataTables'a hiç iletmiyordu
    /// ("İşleniyor…" kalıcı) ve bayat yanıtı süzmüyordu. createAjax ile ikisi de ortak sarmalayıcıdan gelir.
    /// </summary>
    [Theory]
    [InlineData("Providers")]
    [InlineData("Bindings")]
    [InlineData("PromptCategories")]
    public void AiCenter_tablolari_ortak_createAjax_sarmalayicisindan_gecer(string folder)
    {
        var script = Web("Pages", "AiCenter", folder, "Index.js");

        script.ShouldNotContain("ajax: function (data, callback)");
        script.ShouldContain(
            "ajax: abp.libs.datatables.createAjax(function () { return service.getList(); }, null, function (result) {\n" +
            "                return { data: result };\n" +
            "            }),");
    }

    // ─────────────────────────── Ortak sarmalayıcı ───────────────────────────

    /// <summary>
    /// Hata dalı Faz 3'ün GLOBAL sarmalayıcısında kurulur (bayat ret aynı biletle yutulur) ve WP6 canlı
    /// geçidi korunur: küçültülmüş demette de <c>createAjax.toString()</c> <c>apya.latest()</c> taşır.
    /// Yükleme isteği ABP'nin engelleyici penceresini açmaz (karar 2) — iptal kipinde ABP aynen kalır.
    /// </summary>
    [Fact]
    public void Ortak_sarmalayici_hata_dalini_ve_sessiz_yuklemeyi_tasir()
    {
        var latest = Web("wwwroot", "js", "apya-latest.js");

        var wrapper = Between(latest, "dt.createAjax = function (", "\n    }\n})();");
        ShouldAppearInOrder(wrapper,
            "if (cancelPreviousRequest) { return createAjax.apply(this, arguments); }",
            "var promise = quietly(serverMethod, this, arguments);",
            "if (request.isLatest() && loadState && loadState.failTable)",
            "loadState.failTable(request.settings, request.callback, error);",
            "return promise;",
            "var next = apya.latest();");

        Between(latest, "function quietly(", "\n    }\n").ShouldContain("{ abpHandleError: false }");

        var loadState = Web("wwwroot", "js", "apya-load-state.js");
        loadState.ShouldContain("failTable: failTable");
        loadState.ShouldContain("tableFailed: tableFailed");
    }
}
