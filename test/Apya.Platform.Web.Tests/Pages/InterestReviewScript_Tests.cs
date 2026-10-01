using System;
using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// İlgi incelemesi — geçersiz kimlik (GRH-22).
///
/// <para>Silinmiş talebe / yanlış bağlantıya gelen sayfa, API "bulunamadı" (artık 404, bkz.
/// RecordNotFoundPages_Tests) dönünce genel yükleme kartı + işe yaramayan "Tekrar dene" yerine
/// "Bu ilgi talebi bulunamadı" + Taleplere dönüş basar; firma/karar kartları hiç görünmez. 404 kontrolü
/// genel hata dalından ÖNCE gelir ve durumu isteğin jqXHR'ından okur (zarflı hatada söz yalnız zarfla
/// reddeder).</para>
///
/// <para>Sayfa betiği $(fn), bootstrap.Modal ve ABP proxy'si kullandığı için vitest'te koşulamıyor;
/// sözleşme kaynaktan kilitlenir. Ortak yardımcı (apya.loadState.notFoundHtml) apyaLoadState.test.js'te
/// davranışsal test ediliyor.</para>
/// </summary>
public class InterestReviewScript_Tests
{
    private static string Script()
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynak depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, "src", "Apya.Platform.Web", "Pages", "Grants", "InterestReview.js");

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        // Çalışma ağacı CRLF (autocrlf); eşleşmeler LF üzerinden yapılır.
        return File.ReadAllText(path).Replace("\r\n", "\n");
    }

    /// <summary>4 boşluk girintili fonksiyon bildiriminin gövdesi (kapanan '    }' satırına kadar).</summary>
    private static string Body(string source, string declaration)
    {
        var from = source.IndexOf(declaration, StringComparison.Ordinal);
        from.ShouldBeGreaterThanOrEqualTo(0, $"'{declaration}' bulunamadı.");
        var to = source.IndexOf("\n    }\n", from, StringComparison.Ordinal);
        to.ShouldBeGreaterThan(from, $"'{declaration}' gövdesinin sonu bulunamadı.");
        return source.Substring(from, to - from);
    }

    [Fact]
    public void Bulunamayan_talepte_Tekrar_dene_yerine_bulunamadi_durumu_genel_hata_dalindan_once()
    {
        var load = Body(Script(), "function load()");

        var notFound = load.IndexOf("request.jqXHR && request.jqXHR.status === 404", StringComparison.Ordinal);
        var generic = load.IndexOf("apya.loadState.errorHtml(", StringComparison.Ordinal);

        notFound.ShouldBeGreaterThan(0, "404 dalı yok — geçersiz kimlik genel yükleme kartına ve Tekrar dene'ye düşer");
        generic.ShouldBeGreaterThan(notFound, "404 kontrolü genel hata dalından ÖNCE gelmeli");

        var branch = load.Substring(notFound, generic - notFound);
        branch.ShouldContain("apya.loadState.notFoundHtml(");
        branch.ShouldContain("l('Grants:InterestReview:NotFound')");
        branch.ShouldContain("'/Grants/Requests'");
        branch.ShouldContain("$('.apya-irv-state, .apya-irv-layout').addClass('d-none');",
            customMessage: "firma/karar kartları bulunamayan talepte görünmemeli");
        branch.ShouldContain("return;", customMessage: "404'te genel kart ayrıca basılmamalı");
    }
}
