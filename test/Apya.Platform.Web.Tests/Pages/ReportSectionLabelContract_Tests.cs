using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Documents;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 🔴 C# → JS sözleşmesi: rapor derleyici bölüm adını React tarafındaki ELLE yazılmış
/// sözlükten (<c>SECTION_LABEL</c>) okur. Enum'a bölüm eklenip sözlük unutulursa ekran
/// bölümü "Bölüm 13" diye gösterir ve derleme yeşil kalır.
///
/// <para>İki dosya ölçülür ve ikisi de gerekli: KAYNAK (<c>api.js</c>) doğru olabilir
/// ama yayınlanan şey üretilmiş DEMETTİR (<c>wwwroot/js/documents-report.js</c>); kaynak
/// güncellenip <c>npm run build</c> unutulursa kullanıcı yine eski sözlüğü görür.</para>
/// </summary>
public class ReportSectionLabelContract_Tests
{
    private static readonly string WebRoot = Path.Combine(
        Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src", "Apya.Platform.Web", "wwwroot");

    private static readonly int[] EnumValues =
        Enum.GetValues<ReportSectionKey>().Select(k => (int)k).OrderBy(v => v).ToArray();

    /// <summary>Sözlük gövdesindeki sayısal anahtarlar (kaynakta tek tırnak, demette çift tırnak).</summary>
    private static int[] ReadLabelKeys(string path, string declarationPattern)
    {
        File.Exists(path).ShouldBeTrue($"Dosya bulunamadı: {Path.GetFullPath(path)}");

        var body = Regex.Match(File.ReadAllText(path), declarationPattern + @"\s*=\s*\{(?<body>[^}]*)\}").Groups["body"].Value;
        body.ShouldNotBeNullOrWhiteSpace($"sözlük bulunamadı: {Path.GetFileName(path)}");

        return Regex.Matches(body, @"(?m)^\s*(?<k>\d+)\s*:\s*['""]")
            .Select(m => int.Parse(m.Groups["k"].Value))
            .OrderBy(v => v)
            .ToArray();
    }

    [Fact]
    public void Kaynaktaki_bolum_sozlugu_enumla_birebir()
    {
        var keys = ReadLabelKeys(
            Path.Combine(WebRoot, "dynamic-assets", "src", "documents-report", "api.js"),
            @"export const SECTION_LABEL");

        keys.ShouldBe(EnumValues, "api.js › SECTION_LABEL, ReportSectionKey enum'uyla aynı anahtarları taşımalı");
    }

    /// <summary>
    /// Demette değişken adı küçültülmüş olabilir; sözlük, enum'un ilk etiketiyle
    /// ("Proje özeti") tanınır. Kaynak güncellenip demet yeniden üretilmediyse burada
    /// kırmızı verir.
    /// </summary>
    [Fact]
    public void Yayinlanan_demetteki_bolum_sozlugu_enumla_birebir()
    {
        var path = Path.Combine(WebRoot, "js", "documents-report.js");
        File.Exists(path).ShouldBeTrue($"Demet bulunamadı: {Path.GetFullPath(path)}");

        var body = Regex.Match(File.ReadAllText(path), @"\{(?<body>\s*1\s*:\s*""Proje özeti""[^}]*)\}").Groups["body"].Value;
        body.ShouldNotBeNullOrWhiteSpace("demette bölüm sözlüğü bulunamadı — demet yeniden üretilmeli (npm run build)");

        var keys = Regex.Matches(body, @"(?<k>\d+)\s*:\s*""")
            .Select(m => int.Parse(m.Groups["k"].Value))
            .OrderBy(v => v)
            .ToArray();

        keys.ShouldBe(EnumValues,
            "documents-report.js eski: kaynak (api.js) güncellendiyse 'npm run build' ile demeti yeniden üretin");
    }
}
