using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kasa &amp; Banka sayfa betiği sözleşmesi (STA-14, FIN-09, FIN-10).
///
/// <para>Betik $(fn), ModalManager, bootstrap.Modal ve $.get kullandığı için vitest'in jQuery
/// kabuğunda koşturulamıyor; sözleşme kaynaktan kilitlenir. Bozulma ekranda hata vermez:
/// yenileme geri gelirse seçim ve başarı bildirimi kaybolur; kart tıklaması yeniden basılan
/// parçaya bağlanırsa ilk tazelemeden sonra kart seçimi sessizce ölür.</para>
/// </summary>
public class CashAccountsScript_Tests
{
    private static string ReadScript()
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynak depodan okunur.
        var path = Path.Combine(
            Directory.GetCurrentDirectory(),
            "..", "..", "..", "..", "..",
            "src", "Apya.Platform.Web", "Pages", "CashAccounts", "Index.js");

        File.Exists(path).ShouldBeTrue($"Kasa sayfa betiği bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    /// <summary>
    /// <paramref name="name"/> fonksiyonunun gövdesi (süslü parantez sayılarak). Belirteci dosyanın
    /// tamamında aramak davranışı kilitlemez: sabitler ve yorumlar da aynı belirteci taşır.
    /// </summary>
    private static string FunctionBody(string script, string name)
    {
        var start = script.IndexOf("function " + name + "(", StringComparison.Ordinal);
        start.ShouldBeGreaterThanOrEqualTo(0, $"'{name}' fonksiyonu bulunamadı");

        var open = script.IndexOf('{', start);
        var depth = 0;
        for (var i = open; i < script.Length; i++)
        {
            if (script[i] == '{') depth++;
            else if (script[i] == '}' && --depth == 0) return script.Substring(open, i - open + 1);
        }

        throw new ShouldAssertException($"'{name}' gövdesi kapanmıyor");
    }

    /// <summary>
    /// Hareket ekleme/düzenleme/silme ve transfer sayfayı yenilemez; kartlar ve toplam parçayla
    /// tazelenir. Yenileme yalnız hesap modallarında kalır (yeni hesap hareketler kartını ve
    /// transfer listesini de değiştirir).
    /// </summary>
    [Fact]
    public void Hareket_yazmalari_sayfayi_yenilemez()
    {
        var script = ReadScript();

        var reloadLines = script.Split('\n').Where(l => l.Contains("window.location.reload")).ToList();
        reloadLines.ShouldNotBeEmpty("hesap modallarındaki yenileme bekleniyordu");
        reloadLines.ShouldAllBe(l => l.Contains("AccountModal.onResult"),
            "window.location.reload yalnız hesap modallarında kalmalı; hareket ve transfer yazmaları afterWrite kullanır");

        script.ShouldContain("handler=AccountSummary");
        script.ShouldContain("afterWrite(");
    }

    [Fact]
    public void Hareket_listesi_yukleniyor_hata_ve_bayat_cevap_korumali()
    {
        var script = ReadScript();

        script.ShouldContain("apya-skeleton");
        script.ShouldContain("Tekrar dene");
        script.ShouldContain("data-action=\"retry\"");

        // Hareketler ve özet için ayrı bilet: biri diğerinin yanıtını bayatlatmasın.
        Regex.Matches(script, @"apya\.latest\(\)").Count.ShouldBe(2);

        // Her yükleyici kendi biletini alır; başarı ve hata dalı ikisi de bayat yanıtı atar
        // (hata dalı bekçisiz kalırsa eski kartın hatası yeni kartın satırlarını ezer).
        var movements = FunctionBody(script, "loadMovements");
        movements.ShouldContain("var isLatest = nextMovements();");
        movements.ShouldContain(".html(SKELETON_ROWS)");
        Regex.Matches(movements, @"if \(!isLatest\(\)\) return;").Count.ShouldBe(2);

        var summary = FunctionBody(script, "refreshSummary");
        summary.ShouldContain("var isLatest = nextSummary();");
        Regex.Matches(summary, @"if \(!isLatest\(\)\) return;").Count.ShouldBe(2);

        // Hesap değişince eski satırlar yanıt beklenirken yeni başlığın altında kalmaz (FIN-10).
        FunctionBody(script, "selectAccount").ShouldContain("loadMovements(true);");
    }

    [Fact]
    public void Kart_tiklamasi_yeniden_basilan_parcanin_disina_bagli()
    {
        var script = ReadScript();

        script.ShouldContain("$('#AccountSummary').on('click'");
        script.ShouldNotContain("$('#AccountCards').on(", Case.Sensitive,
            "#AccountCards parçayla yeniden basılıyor; ona bağlanan dinleyici ilk tazelemede ölür");
    }

    [Fact]
    public void Transfer_widgeti_yalniz_kirliyse_yeniden_baglanir()
    {
        var script = ReadScript();

        // Hareket yazımı kirletir, yeniden bağlama temizler, açılış yalnız kirliyse bağlar.
        FunctionBody(script, "afterWrite").ShouldContain("transferDirty = true;");
        FunctionBody(script, "mountTransfer").ShouldContain("transferDirty = false;");
        script.ShouldMatch(@"if \(transferDirty\)\s*\{\s*mountTransfer\(\);\s*\}");
    }

    /// <summary>Faz 1 XSS düzeltmesi: gider başlığından gelen açıklama metin olarak basılır.</summary>
    [Fact]
    public void Hareket_aciklamasi_kacisli_basilir()
    {
        ReadScript().ShouldContain("esc(m.description");
    }
}
