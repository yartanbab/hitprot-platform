using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Features;
using Volo.Abp.Settings;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Betiklerin ve React kaynağının adıyla sorduğu her izin, özellik ve ayar TANIMLIDIR.
///
/// <para>Ad düz dizgidir; tanımsız bir ad hata vermez, <c>abp.auth.isGranted</c> sessizce
/// <c>false</c> döner ve arkasındaki düğme kimseye çıkmaz. Görev detayında gidere evrak bağlama
/// böyle hiç açılmıyordu: <c>'Platform.Documents.Default'</c> soruluyordu, iznin adı ise
/// <c>Platform.Documents</c> (C# sabitinin ADI Default, DEĞERİ değil). Birim testi aynı yanlış
/// adı taklit ettiği için yeşildi.</para>
/// </summary>
public class ScriptPermissionNames_Tests : PlatformWebTestBase
{
    // 'Platform.Tasks.Create' · "Ai.Prompts.Edit" · `Platform.AiAssist`
    private static readonly Regex DottedName = new(
        @"['""`](?<name>(?:Platform|Ai)\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*)['""`]",
        RegexOptions.Compiled);

    /// <summary>İzin, özellik ya da ayar adı olmayan düz dizgiler ("dosya: dizgi").</summary>
    private static readonly HashSet<string> NotNames = new(StringComparer.Ordinal)
    {
    };

    [Fact]
    public async Task Kaynakta_Sorulan_Izin_Ozellik_Ve_Ayar_Adlari_Tanimlidir()
    {
        var known = new HashSet<string>(StringComparer.Ordinal);
        known.UnionWith((await GetRequiredService<IPermissionDefinitionManager>().GetPermissionsAsync()).Select(p => p.Name));
        known.UnionWith((await GetRequiredService<IFeatureDefinitionManager>().GetAllAsync()).Select(f => f.Name));
        known.UnionWith((await GetRequiredService<ISettingDefinitionManager>().GetAllAsync()).Select(s => s.Name));

        var files = WebSourceFiles.HandWrittenScripts()
            .Concat(WebSourceFiles.Under(".cshtml", "src/Apya.Platform.Web/Pages", "src/Apya.Platform.Web/Components"))
            .Concat(ReactSources())
            .ToList();

        var unknown = new SortedSet<string>(StringComparer.Ordinal);
        var names = new HashSet<string>(StringComparer.Ordinal);
        foreach (var file in files)
        {
            var relative = WebSourceFiles.Relative(file);
            var lines = File.ReadAllLines(file);
            for (var i = 0; i < lines.Length; i++)
            {
                // Yorum satırındaki örnek ("ileride: isGranted('Platform.X')") kullanım değildir.
                var lead = lines[i].TrimStart();
                if (lead.StartsWith("//") || lead.StartsWith("*") || lead.StartsWith("/*") || lead.StartsWith("@*")) { continue; }

                foreach (Match m in DottedName.Matches(lines[i]))
                {
                    var name = m.Groups["name"].Value;
                    if (NotNames.Contains($"{relative}: {name}")) { continue; }

                    names.Add(name);
                    if (!known.Contains(name))
                    {
                        unknown.Add($"{relative}:{i + 1}  →  {name}");
                    }
                }
            }
        }

        // Tarama bozulursa test SESSİZCE geçmemeli.
        names.Count.ShouldBeGreaterThan(40, "beklenenden az ad bulundu");
        unknown.ShouldBeEmpty(
            "Şu adlarla tanımlı bir izin, özellik ya da ayar yok (koşul hep yanlış çıkar). " +
            "C# sabitinin adını değil DEĞERİNİ yazın; ad değilse NotNames'e ekleyin:\n" +
            string.Join("\n", unknown));
    }

    /// <summary>React kaynağı (testler hariç). Derlenmiş demet değil: orada adlar küçültülmüş koda gömülüdür.</summary>
    private static IEnumerable<string> ReactSources()
    {
        var src = Path.Combine(WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Web", "wwwroot", "dynamic-assets", "src");
        return Directory.EnumerateFiles(src, "*.js*", SearchOption.AllDirectories)
            .Where(f => f.EndsWith(".jsx", StringComparison.Ordinal) || f.EndsWith(".js", StringComparison.Ordinal))
            .Where(f => !f.Contains(".test.", StringComparison.Ordinal));
    }
}
