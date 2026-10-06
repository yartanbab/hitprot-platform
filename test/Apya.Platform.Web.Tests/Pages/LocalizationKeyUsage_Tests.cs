using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kaynakta DÜZ yazılmış her yerelleştirme anahtarı çözülür.
///
/// <para>Anahtar <c>tr.json</c>'da yoksa ABP istisna ATMAZ, anahtarın kendisini döndürür: ekranda
/// "Grants:Impl:Paid" yazar. Betik tarafı hiçbir .NET testinde çalışmadığı, Razor tarafı da ancak
/// o dal çizilirse ölçüldüğü için bu sessizce geçer. <c>GanttLocalization_Tests</c> aynı ölçümü
/// tek dosya için yapıyordu; burada elle yazılmış bütün betikler, görünümler ve sunucu kodu taranır.
/// Elle güncellenen bir liste yoktur — yeni bir kullanım kendiliğinden kapsama girer.</para>
/// </summary>
public class LocalizationKeyUsage_Tests : PlatformWebTestBase
{
    // (?<![\w$.]) — `.html('…')`, `$el('…')` gibi çağrılar da "l('" ile biter; sınır olmadan anahtar sanılır.
    private static readonly Regex ScriptKey = new(
        @"(?<![\w$.])l\(\s*(['""])(?<key>[^'""\r\n]+?)\1\s*(?<next>[,)+])", RegexOptions.Compiled);

    private static readonly Regex ServerKey = new(
        @"(?<![\w.])L\[\s*""(?<key>[^""\r\n]+?)""\s*(?<next>[\],+])", RegexOptions.Compiled);

    private static readonly Regex ScriptResource = new(
        @"getResource\(\s*['""](?<name>[A-Za-z]+)['""]\s*\)", RegexOptions.Compiled);

    // Görünümde L başka bir kaynağa bağlanmışsa (hesap sayfaları AccountResource kullanır) o dosya
    // bu kaynağın sözleşmesine girmez.
    private static readonly Regex ForeignViewLocalizer = new(
        @"@inject\s+I(?:Html|String)Localizer<(?!PlatformResource>)[\w.]+>\s+L\b", RegexOptions.Compiled);

    // Sunucu kodunda da L başka bir kaynağın olabilir (OpenIddict tohumlayıcısı kendi kaynağını kullanır).
    private static readonly Regex ForeignServerLocalizer = new(
        @"IStringLocalizer<(?!PlatformResource>)[\w.]+>\s+L\b", RegexOptions.Compiled);

    private readonly IStringLocalizer<PlatformResource> _localizer;

    public LocalizationKeyUsage_Tests()
    {
        _localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    private sealed record Usage(string Key, bool IsPrefix, string Where);

    private static IEnumerable<Usage> Extract(Regex regex, string file, string text)
    {
        var lineStarts = new List<int> { 0 };
        for (var i = 0; i < text.Length; i++)
        {
            if (text[i] == '\n') { lineStarts.Add(i + 1); }
        }

        foreach (Match m in regex.Matches(text))
        {
            var key = m.Groups["key"].Value;
            // Enterpolasyonlu ya da yer tutuculu metin anahtar değildir; ASCII dışı karakter taşıyan
            // da (yorumdaki "l('…:LoadFailed')" örneği gibi) düzyazıdır.
            if (key.Contains('{') || key.Contains('$') || key.Any(c => c > 127)) { continue; }

            var line = lineStarts.BinarySearch(m.Index);
            line = line < 0 ? ~line : line + 1;

            // Yorum satırındaki örnek (ör. "L["Anahtar"] ham anahtar döndürür") kullanım değildir.
            var lineStart = lineStarts[line - 1];
            var lead = text.Substring(lineStart, m.Index - lineStart).TrimStart();
            if (lead.StartsWith("//") || lead.StartsWith("*") || lead.StartsWith("/*")) { continue; }

            yield return new Usage(key, m.Groups["next"].Value == "+", $"{WebSourceFiles.Relative(file)}:{line}");
        }
    }

    private static List<Usage> CollectUsages()
    {
        var usages = new List<Usage>();

        foreach (var file in WebSourceFiles.HandWrittenScripts())
        {
            var text = File.ReadAllText(file);
            // l başka bir kaynağa bağlıysa (ör. ABP'nin kendi modülü) bu sözleşmenin konusu değil.
            if (!text.Contains("getResource('Platform')") && !text.Contains("getResource(\"Platform\")"))
            {
                continue;
            }

            usages.AddRange(Extract(ScriptKey, file, text));
        }

        foreach (var file in WebSourceFiles.Under(".cshtml",
                     "src/Apya.Platform.Web/Pages", "src/Apya.Platform.Web/Components", "src/Apya.Platform.Web/Views"))
        {
            var text = File.ReadAllText(file);
            if (!ForeignViewLocalizer.IsMatch(text))
            {
                usages.AddRange(Extract(ServerKey, file, text));
            }
        }

        foreach (var file in WebSourceFiles.Under(".cs",
                     "src/Apya.Platform.Web/Pages", "src/Apya.Platform.Web/Menus", "src/Apya.Platform.Web/Components",
                     "src/Apya.Platform.Application", "src/Apya.Platform.Application.Contracts", "src/Apya.Platform.Domain"))
        {
            var text = File.ReadAllText(file);
            if (!ForeignServerLocalizer.IsMatch(text))
            {
                usages.AddRange(Extract(ServerKey, file, text));
            }
        }

        return usages;
    }

    [Fact]
    public void Kaynakta_Duz_Yazilan_Her_Anahtar_Cozulur()
    {
        using var _ = CultureHelper.Use("tr");
        var usages = CollectUsages();

        // Tarama bozulursa test SESSİZCE geçmemeli — aksi halde hiçbir şey ölçmez.
        usages.Count(u => !u.IsPrefix).ShouldBeGreaterThan(1500, "beklenenden az anahtar bulundu; tarama bozulmuş olabilir");

        var missing = usages
            .Where(u => !u.IsPrefix)
            .GroupBy(u => u.Key)
            .Where(g => _localizer[g.Key].ResourceNotFound)
            .Select(g => $"{g.Key}  ←  {g.First().Where}")
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        missing.ShouldBeEmpty(
            "Şu anahtarların karşılığı yok — ekranda anahtarın kendisi görünür:\n" + string.Join("\n", missing));
    }

    /// <summary>
    /// <c>l('Önek:' + deger)</c> biçiminde kurulan anahtarda önek yanlış yazılırsa TÜM değerler ham
    /// görünür. Her önekle başlayan en az bir anahtar olmalı.
    /// </summary>
    [Fact]
    public void Birlestirilerek_Kurulan_Anahtarlarin_Oneki_Gercek()
    {
        using var _ = CultureHelper.Use("tr");
        var known = _localizer.GetAllStrings(includeParentCultures: true).Select(s => s.Name).ToList();

        var dead = CollectUsages()
            .Where(u => u.IsPrefix)
            .GroupBy(u => u.Key)
            .Where(g => !known.Any(k => k.StartsWith(g.Key, StringComparison.Ordinal)))
            .Select(g => $"{g.Key}  ←  {g.First().Where}")
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        dead.ShouldBeEmpty("Şu öneklerle başlayan hiçbir anahtar yok:\n" + string.Join("\n", dead));
    }

    /// <summary>
    /// Betik <c>getResource('X')</c> ile var olmayan bir kaynağa bağlanırsa o dosyadaki BÜTÜN metinler
    /// ham anahtar olur ve yukarıdaki tarama o dosyayı atladığı için bunu görmez.
    /// </summary>
    [Fact]
    public void Betikler_Var_Olan_Kaynaga_Baglanir()
    {
        var wrong = new List<string>();
        foreach (var file in WebSourceFiles.HandWrittenScripts())
        {
            foreach (Match m in ScriptResource.Matches(File.ReadAllText(file)))
            {
                if (m.Groups["name"].Value != "Platform")
                {
                    wrong.Add($"{WebSourceFiles.Relative(file)}: getResource('{m.Groups["name"].Value}')");
                }
            }
        }

        wrong.ShouldBeEmpty("Bu betikler 'Platform' dışında bir kaynak istiyor:\n" + string.Join("\n", wrong));
    }

    /// <summary>Çıkarıcının kendisi: sınır, önek, yer tutucu ve yorum satırı kuralları.</summary>
    [Fact]
    public void Cikarici_Sinirlari_Dogru_Okur()
    {
        const string script =
            "var a = l('Grants:Impl:Paid');\n" +
            "$x.html('Sahte:Anahtar'); el('Sahte:Iki');\n" +
            "var b = l('Grants:Impl:Status:' + k);\n" +
            "var c = l(\"Grants:Impl:Title\", 3);\n" +
            "// örnek: l('Yorum:Anahtar')\n" +
            " * örnek: l('Yorum:Iki')";

        var found = Extract(ScriptKey, Path.Combine(WebSourceFiles.RepoRoot(), "x.js"), script).ToList();

        found.Select(u => u.Key).ShouldBe(
            new[] { "Grants:Impl:Paid", "Grants:Impl:Status:", "Grants:Impl:Title" }, ignoreOrder: false);
        found.Single(u => u.IsPrefix).Key.ShouldBe("Grants:Impl:Status:");
        found[2].Where.ShouldBe("x.js:4");
    }
}
