using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.AspNetCore.Routing;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Betiklerin ve React kaynağının adıyla çağırdığı her sayfa işleyicisi (<c>?handler=Ad</c>) VARDIR.
///
/// <para>İşleyici adı düz dizgidir; sayfa modelindeki <c>OnPostAd</c> yeniden adlandırılır ya da
/// silinirse derleyici görmez, çağrı 400/404 döner ve düğme "hiçbir şey yapmaz". Uygulama servisi
/// vekilleri için aynı kilit <see cref="ScriptProxyCalls_Tests"/>; bu, sayfa işleyicileri için olanı.
/// İşleyiciler kaynak dosyadan değil ÇALIŞAN uygulamanın derlenmiş sayfalarından okunur (çerçevenin
/// taban modellerinden miras alınanlar dahil).</para>
/// </summary>
public class PageHandlerCalls_Tests : PlatformWebTestBase
{
    // '?handler=DeleteFile' · "&handler=Board" · asp-page-handler="Save" · handler: 'Export'
    private static readonly Regex NamedHandler = new(
        @"(?:[?&]handler=|asp-page-handler=""|\bhandler:\s*['""`])(?<name>[A-Z][A-Za-z0-9]*)",
        RegexOptions.Compiled);

    // handler('DeleteFile', …) · handlerUrl('Matches', …) · handler('Timeline', 'CreateRisk')
    // İki dizgili biçimde ilki sayfa, ikincisi işleyicidir.
    private static readonly Regex HelperCall = new(
        @"\bhandler(?:Url)?\(\s*['""`](?<first>[A-Z][A-Za-z0-9]*)['""`](?:\s*,\s*['""`](?<second>[A-Z][A-Za-z0-9]*)['""`])?",
        RegexOptions.Compiled);

    [Fact]
    public async Task Kaynakta_Cagrilan_Her_Sayfa_Isleyicisi_Vardir()
    {
        var loader = GetRequiredService<PageLoader>();
        var handlersByPage = new Dictionary<string, HashSet<string>>(StringComparer.OrdinalIgnoreCase);
        var allHandlers = new HashSet<string>(StringComparer.Ordinal);
        foreach (var endpoint in GetRequiredService<IEnumerable<EndpointDataSource>>()
                     .SelectMany(s => s.Endpoints).OfType<RouteEndpoint>())
        {
            var page = endpoint.Metadata.GetMetadata<PageActionDescriptor>();
            if (page == null) { continue; }

            var compiled = await loader.LoadAsync(page, endpoint.Metadata);
            var names = compiled.HandlerMethods.Where(h => !string.IsNullOrEmpty(h.Name)).Select(h => h.Name!).ToList();
            allHandlers.UnionWith(names);

            // "/Documents/Matching" → "Matching"; aynı son parçayı paylaşan sayfaların işleyicileri birleşir.
            var lastSegment = page.ViewEnginePath.TrimEnd('/').Split('/').Last();
            if (!handlersByPage.TryGetValue(lastSegment, out var set))
            {
                handlersByPage[lastSegment] = set = new HashSet<string>(StringComparer.Ordinal);
            }
            set.UnionWith(names);
        }

        allHandlers.Count.ShouldBeGreaterThan(100, "beklenenden az sayfa işleyicisi bulundu");

        var files = WebSourceFiles.HandWrittenScripts()
            .Concat(WebSourceFiles.Under(".cshtml", "src/Apya.Platform.Web/Pages", "src/Apya.Platform.Web/Components"))
            .Concat(WebSourceFiles.ReactSources())
            .ToList();

        var missing = new SortedSet<string>(StringComparer.Ordinal);
        var calls = 0;
        foreach (var file in files)
        {
            var relative = WebSourceFiles.Relative(file);
            var lines = File.ReadAllLines(file);
            for (var i = 0; i < lines.Length; i++)
            {
                // Yorum satırındaki örnek kullanım değildir.
                var lead = lines[i].TrimStart();
                if (lead.StartsWith("//") || lead.StartsWith("*") || lead.StartsWith("/*") || lead.StartsWith("@*")) { continue; }

                foreach (Match m in NamedHandler.Matches(lines[i]))
                {
                    calls++;
                    var name = m.Groups["name"].Value;
                    if (!allHandlers.Contains(name))
                    {
                        missing.Add($"{relative}:{i + 1}  →  handler={name}");
                    }
                }

                foreach (Match m in HelperCall.Matches(lines[i]))
                {
                    calls++;
                    var first = m.Groups["first"].Value;
                    var second = m.Groups["second"].Value;
                    if (second.Length == 0)
                    {
                        if (!allHandlers.Contains(first))
                        {
                            missing.Add($"{relative}:{i + 1}  →  handler('{first}')");
                        }
                    }
                    else if (!handlersByPage.TryGetValue(first, out var onPage) || !onPage.Contains(second))
                    {
                        missing.Add($"{relative}:{i + 1}  →  handler('{first}', '{second}')");
                    }
                }
            }
        }

        // Tarama bozulursa test SESSİZCE geçmemeli.
        calls.ShouldBeGreaterThan(150, "beklenenden az işleyici çağrısı bulundu");
        missing.ShouldBeEmpty(
            "Şu çağrıların karşılığında sayfa işleyicisi yok (istek 400/404 döner):\n" + string.Join("\n", missing));
    }
}
