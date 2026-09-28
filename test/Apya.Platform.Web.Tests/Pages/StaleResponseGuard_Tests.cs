using System.IO;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// BAYAT YANIT KORUMASI sözleşmesi (STA-09, RES-07, CUS-13, RES-14).
///
/// <para><c>apya-latest.js</c> global demette yüklenir; Faturalar ve Bildirimler betikleri
/// <c>apya.latest</c> biletini kullanır. Bu iki sayfa betiği jQuery'nin tamamını istediği için
/// vitest'te koşulamıyor; sözleşme kaynaktan kilitlenir. Yardımcının kendisi ve kanban
/// <c>apyaLatest.test.js</c> ile <c>apyaKanban.test.js</c>'te davranışsal test ediliyor.</para>
///
/// <para>Bozulma ekranda hata vermez: yardımcı demetten düşerse sayfa betiği TypeError ile
/// hiç çalışmaz; bilet kontrolü düşerse geç dönen eski yanıt yeni sorgunun listesini sessizce ezer.</para>
/// </summary>
public class StaleResponseGuard_Tests
{
    private static string ReadSource(params string[] relative)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynaklar depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, Path.Combine(relative));

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    /// <summary>Başlangıçtan bir sonraki bitişe kadar olan metin (fonksiyon gövdesi yaklaşımı).</summary>
    private static string Between(string source, string start, string end)
    {
        var from = source.IndexOf(start, System.StringComparison.Ordinal);
        from.ShouldBeGreaterThanOrEqualTo(0, $"'{start}' bulunamadı.");
        var to = source.IndexOf(end, from + start.Length, System.StringComparison.Ordinal);
        to.ShouldBeGreaterThan(from, $"'{start}' sonrasında '{end}' bulunamadı.");
        return source.Substring(from, to - from);
    }

    /// <summary>
    /// Yardımcı her sayfada, sayfa betiklerinden ÖNCE hazır olmalı. apya-money.js'ten sonra
    /// kayıtlı olması tema katkılarından (datatables-extensions dahil) sonra geldiğini de gösterir;
    /// createAjax sarmalayıcısı ancak o zaman kurulabilir.
    /// </summary>
    [Fact]
    public void Yardimci_global_demette_apya_money_sonrasinda_kayitli()
    {
        var module = ReadSource("src", "Apya.Platform.Web", "PlatformWebModule.cs");

        var money = module.IndexOf("\"/js/apya-money.js\"", System.StringComparison.Ordinal);
        var latest = module.IndexOf("\"/js/apya-latest.js\"", System.StringComparison.Ordinal);

        money.ShouldBeGreaterThanOrEqualTo(0);
        latest.ShouldBeGreaterThan(money, "apya-latest.js global demete apya-money.js'ten SONRA eklenmeli.");
    }

    [Fact]
    public void Faturalar_liste_ve_detay_bayat_yaniti_yutuyor_durumlari_state_te_tutuyor()
    {
        var script = ReadSource("src", "Apya.Platform.Web", "Pages", "Invoices", "index.js");

        // Liste ve detay için iki ayrı bilet.
        Regex.Matches(script, Regex.Escape("apya.latest()")).Count.ShouldBe(2);

        // Yükleniyor/hata durumu yalnız DOM'da olsaydı süzgeç ve çip onu "bulunamadı" ile ezerdi.
        script.ShouldContain("state.loading");
        script.ShouldContain("state.loadFailed");

        // Hata bloğu role=listbox'ın DIŞINA basılır; listbox'ın çocukları option'dan ibaret kalır.
        script.ShouldContain(".insertAfter($empty)");

        // Seçili fatura süzgeç dışına düşerse panel boşalır ("Ödeme Ekle" eski faturada kalmaz).
        Between(script, "function applyFilter", "function renderList").ShouldContain("renderDetailEmpty");
    }

    [Fact]
    public void Bildirimler_liste_ve_ozet_bayat_yaniti_yutuyor()
    {
        var script = ReadSource("src", "Apya.Platform.Web", "Pages", "Notifications", "Index.js");

        script.ShouldContain("var nextList = apya.latest();");
        var list = Between(script, "function loadNotifications", "function reload");
        list.ShouldContain("nextList()");
        list.ShouldContain("if (!isLatest())");

        script.ShouldContain("var nextSummary = apya.latest();");
        var summary = Between(script, "function refreshSummary", "function buildInput");
        summary.ShouldContain("nextSummary()");
        summary.ShouldContain("isLatest()");
    }
}
