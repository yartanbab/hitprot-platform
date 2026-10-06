using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Grants;
using Apya.Platform.Localization;
using Apya.Platform.Permissions;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp.Localization;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Betikteki "enum aynası" dizileri C# enum'uyla birebir aynıdır.
///
/// <para>Sayfa betikleri sunucudan gelen enum değerini İNDEKS olarak kullanır:
/// <c>var stageKeys = ['Basvuru', 'Degerlendirme', …]; l('Grants:Stage:' + stageKeys[r.stage])</c>.
/// Enum'a üye eklenir ya da sırası değişirse derleyici görmez, hata da çıkmaz: ekran yanlış etiketi
/// yazar (ödenmiş dilim bir dönem "İptal" görünüyordu) ya da ham anahtar basar.
/// <c>GrantTrancheStatus</c> için tek dosyalık bir kilit vardı; burada bütün aynalar ölçülür.</para>
///
/// <para>Hangi dizinin hangi enum'un aynası olduğu ELLE yazılmaz: dizinin elemanlarının çoğu bir
/// enum'un üye adlarıysa o enum'un aynası sayılır. Böylece "Iptal" gibi enum'da HİÇ olmayan bir ad
/// taşıyan bozuk ayna da yakalanır.</para>
/// </summary>
public class EnumMirrorArrays_Tests : PlatformWebTestBase
{
    private static readonly Regex ArrayLiteral = new(
        @"\b(?:var|let|const)\s+(?<name>\w+)\s*=\s*\[(?<body>(?:\s*'[A-Za-z0-9_]+'\s*,?\s*(?://[^\n]*\n)?)+)\]",
        RegexOptions.Compiled);

    private static readonly Regex Item = new(@"'(?<v>[A-Za-z0-9_]+)'", RegexOptions.Compiled);

    // l('Önek:' + dizi[…])  ya da  l('Önek:' + dizi[…] + ':Sonek')
    private static readonly Regex IndexedKey = new(
        @"(?<![\w$.])l\(\s*'(?<prefix>[^'\r\n]+?)'\s*\+\s*(?<array>\w+)\s*\[[^\]\r\n]*\]\s*(?:\+\s*'(?<suffix>[^'\r\n]*)')?\s*[,)]",
        RegexOptions.Compiled);

    /// <summary>
    /// Bir enum'la tesadüfen örtüşen ama aynası OLMAYAN diziler ("dosya:dizi"). Bugün yok; test
    /// böyle bir dizide kırılırsa buraya gerekçesiyle eklenir.
    /// </summary>
    private static readonly HashSet<string> NotMirrors = new(StringComparer.Ordinal);

    private readonly IStringLocalizer<PlatformResource> _localizer;

    public EnumMirrorArrays_Tests()
    {
        _localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    private sealed record ScriptArray(string File, string Name, int Line, List<string> Items, string Text);

    private static List<ScriptArray> Arrays()
    {
        var arrays = new List<ScriptArray>();
        foreach (var file in WebSourceFiles.HandWrittenScripts())
        {
            var text = File.ReadAllText(file);
            foreach (Match m in ArrayLiteral.Matches(text))
            {
                var items = Item.Matches(m.Groups["body"].Value).Select(x => x.Groups["v"].Value).ToList();
                if (items.Count < 2) { continue; }

                var line = text.Take(m.Index).Count(c => c == '\n') + 1;
                arrays.Add(new ScriptArray(WebSourceFiles.Relative(file), m.Groups["name"].Value, line, items, text));
            }
        }

        return arrays;
    }

    private static List<Type> Enums() =>
        new[]
            {
                typeof(PlatformResource).Assembly,      // Domain.Shared
                typeof(PlatformPermissions).Assembly,   // Application.Contracts
                typeof(Grant).Assembly,                 // Domain
                typeof(Apya.Platform.Web.Pages.PlatformPageModel).Assembly // Web
            }
            .Distinct()
            .SelectMany(a => a.GetTypes())
            .Where(t => t.IsEnum)
            .ToList();

    /// <summary>Dizinin aynası olduğu enum'lar: elemanların en az %60'ı (ve en az ikisi) üye adı.</summary>
    private static List<Type> MirrorCandidates(ScriptArray array, List<Type> enums)
    {
        var scored = enums
            .Select(e =>
            {
                var names = Enum.GetNames(e);
                var hit = array.Items.Count(names.Contains);
                return (Enum: e, Hit: hit, Score: (double)hit / Math.Max(array.Items.Count, names.Length));
            })
            .Where(x => x.Hit >= 2 && x.Hit >= Math.Ceiling(array.Items.Count * 0.6))
            .ToList();

        if (scored.Count == 0) { return new List<Type>(); }

        var best = scored.Max(x => x.Score);
        return scored.Where(x => Math.Abs(x.Score - best) < 0.0001).Select(x => x.Enum).ToList();
    }

    /// <summary>Enum üyeleri DEĞER sırasıyla; ayna indeksle okunduğu için değerler 0..n-1 olmalı.</summary>
    private static string[]? NamesByIndex(Type e)
    {
        var pairs = Enum.GetValues(e).Cast<object>()
            .Select(v => (Name: v.ToString()!, Value: Convert.ToInt64(v)))
            .OrderBy(p => p.Value)
            .ToList();

        return pairs.Select((p, i) => p.Value == i).All(ok => ok) ? pairs.Select(p => p.Name).ToArray() : null;
    }

    [Fact]
    public void Betikteki_Her_Enum_Aynasi_Enumla_Birebir_Ayni()
    {
        var enums = Enums();
        var problems = new List<string>();
        var mirrors = 0;

        foreach (var array in Arrays())
        {
            if (NotMirrors.Contains($"{array.File}:{array.Name}")) { continue; }

            var candidates = MirrorCandidates(array, enums);
            if (candidates.Count == 0) { continue; }

            mirrors++;
            // Aynı adları taşıyan iki enum olabilir; herhangi biriyle birebir aynıysa ayna doğrudur.
            if (candidates.Any(e => NamesByIndex(e)?.SequenceEqual(array.Items) == true)) { continue; }

            var closest = candidates[0];
            problems.Add(
                $"{array.File}:{array.Line}  {array.Name} = [{string.Join(", ", array.Items)}]\n" +
                $"    {closest.Name} = [{string.Join(", ", NamesByIndex(closest) ?? Enum.GetNames(closest))}]");
        }

        // Tarama bozulursa test SESSİZCE geçmemeli.
        mirrors.ShouldBeGreaterThan(25, "beklenenden az enum aynası bulundu; tarama bozulmuş olabilir");

        problems.ShouldBeEmpty(
            "Şu diziler aynası oldukları enum'la aynı değil (sıra kaymış ya da üye eksik/fazla) — " +
            "ekranda yanlış etiket ya da ham anahtar çıkar. Ayna değilse NotMirrors'a ekleyin:\n" +
            string.Join("\n", problems));
    }

    /// <summary>
    /// Ayna doğru olsa bile her üyenin metni olmalı: <c>l('Önek:' + dizi[deger])</c> kullanımında
    /// dizinin her elemanı için anahtar çözülür.
    /// </summary>
    [Fact]
    public void Dizi_Elemaniyla_Kurulan_Her_Anahtar_Cozulur()
    {
        using var _ = CultureHelper.Use("tr");
        var missing = new List<string>();
        var checkedUsages = 0;

        foreach (var group in Arrays().GroupBy(a => a.File))
        {
            var byName = group.GroupBy(a => a.Name).ToDictionary(g => g.Key, g => g.First());
            var seen = new HashSet<string>();

            foreach (Match m in IndexedKey.Matches(group.First().Text))
            {
                if (!byName.TryGetValue(m.Groups["array"].Value, out var array)) { continue; }

                var prefix = m.Groups["prefix"].Value;
                var suffix = m.Groups["suffix"].Value;
                if (!seen.Add(prefix + "|" + array.Name + "|" + suffix)) { continue; }

                checkedUsages++;
                var gone = array.Items.Where(item => _localizer[prefix + item + suffix].ResourceNotFound).ToList();
                if (gone.Count > 0)
                {
                    missing.Add($"{array.File}  {prefix}+{array.Name}[…]{suffix}  eksik: {string.Join(", ", gone)}");
                }
            }
        }

        checkedUsages.ShouldBeGreaterThan(20, "beklenenden az kullanım bulundu; tarama bozulmuş olabilir");
        missing.ShouldBeEmpty("Şu dizi elemanlarının metni yok:\n" + string.Join("\n", missing));
    }
}
