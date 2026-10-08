using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Notifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Template;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Uygulamanın kullanıcıya verdiği her iç bağlantı var olan bir sayfaya gider.
///
/// <para>Bağlantı adresleri düz dizgidir: sayfa taşınır ya da yeniden adlandırılırsa derleyici
/// görmez, bağlantı sessizce 404'e döner. Genel Bakış'taki "AI Merkezi →" bağlantısı böyle ölmüştü
/// (<c>/Ai/Dashboard</c>; sayfa <c>/AiCenter/Dashboard</c>). Burada adresler ÇALIŞAN uygulamanın
/// rota tablosuna karşı ölçülür: bildirimlerin tıklanınca götürdüğü adresler ile menü, sayfa,
/// betik, servis ve React kaynağındaki düz adresler.</para>
/// </summary>
public class InternalLinks_Tests : PlatformWebTestBase
{
    // '/Grants/Appeal?id=' · "/Documents" · `/Tasks/Detail/${id}` · "/Tasks/Detail/@Model.Id" —
    // büyük harfle başlayan ilk parça sayfa adresidir (API, statik dosya ve ABP uçları küçük
    // harfle başlar). Uzantılı yollar ("/Pages/x.js", "~/Pages/_Layout.cshtml") adres değildir:
    // ileri bakış noktada durur.
    private static readonly Regex LiteralPath = new(
        @"['""`]~?(?<path>/[A-Z][A-Za-z0-9]*(?:/[A-Za-z0-9_-]+)*)/?(?=['""`?#@]|\$?\{)",
        RegexOptions.Compiled);

    // href="/gizlilik-politikasi" — küçük harfle başlayan sayfa adresi yalnız bağlantı özniteliğinde aranır
    // (başka yerde küçük harfli yol API ya da dosya yoludur).
    private static readonly Regex LowercaseHref = new(
        @"href=['""]~?(?<path>/[a-z][A-Za-z0-9-]*(?:/[A-Za-z0-9_-]+)*)/?(?=['""?#])",
        RegexOptions.Compiled);

    // asp-page="/X/Index" · RedirectToPage("/X/Index") · Url.Page("/X/Index") sayfanın ADINI verir, adresini
    // değil; özel rotalı sayfada ikisi ayrıdır (adı "/CompanyProfile/Index", adresi "/CompanyProfile").
    private static readonly Regex PageNameContext = new(
        @"(?:asp-page=|RedirectToPage\(|Url\.Page\()\s*$",
        RegexOptions.Compiled);

    /// <summary>Adres olmayan düz dizgiler ("dosya: dizgi").</summary>
    private static readonly HashSet<string> NotLinks = new(StringComparer.Ordinal)
    {
        // "cmd.exe /C" anahtarı.
        "src/Apya.Platform.Domain/Data/PlatformDbMigrationService.cs: /C",
    };

    private List<TemplateMatcher>? _matchers;
    private HashSet<string>? _pageNames;

    private List<TemplateMatcher> Matchers()
    {
        if (_matchers != null) { return _matchers; }

        var matchers = new List<TemplateMatcher>();
        _pageNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var endpoint in GetRequiredService<IEnumerable<EndpointDataSource>>()
                     .SelectMany(s => s.Endpoints).OfType<RouteEndpoint>())
        {
            var page = endpoint.Metadata.GetMetadata<PageActionDescriptor>();
            var isPage = page != null;
            if (page != null) { _pageNames.Add(page.ViewEnginePath); }
            var action = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>();
            // Genel {controller}/{action} rotası her adrese uyar; yalnız açık rotası olan uçlar sayılır.
            if (!isPage && action?.AttributeRouteInfo == null) { continue; }

            matchers.Add(new TemplateMatcher(
                TemplateParser.Parse(endpoint.RoutePattern.RawText!),
                new RouteValueDictionary(endpoint.RoutePattern.Defaults)));
        }

        matchers.Count.ShouldBeGreaterThan(200, "beklenenden az rota bulundu");
        return _matchers = matchers;
    }

    /// <summary>Adres var olan bir sayfaya uyuyor mu? Kimliği yolda bekleyen sayfalar için sona örnek parça eklenir.</summary>
    private bool Exists(string path)
    {
        bool Match(string candidate) =>
            Matchers().Any(m => m.TryMatch(new PathString(candidate), new RouteValueDictionary()));

        return Match(path) || Match(path.TrimEnd('/') + "/" + Guid.NewGuid());
    }

    private bool PageNameExists(string name)
    {
        Matchers();
        return _pageNames!.Contains(name);
    }

    [Fact]
    public void Olmayan_Sayfa_Var_Sayilmaz()
    {
        // Her adrese uyan bir rota (tümünü-yakala gibi) eklenirse aşağıdaki testler SESSİZCE geçer.
        Exists("/Ai/Dashboard").ShouldBeFalse();
        Exists("/BoyleBirSayfa/Yok").ShouldBeFalse();
        Exists("/AiCenter/Dashboard").ShouldBeTrue();
        Exists("/Tasks/Detail").ShouldBeTrue();

        // Özel rotalı sayfa: adı var, o adla ADRES yok.
        PageNameExists("/Legal/Gizlilik").ShouldBeTrue();
        Exists("/Legal/Gizlilik").ShouldBeFalse();
        Exists("/gizlilik-politikasi").ShouldBeTrue();
    }

    [Fact]
    public void Bildirim_Baglantilari_Var_Olan_Sayfaya_Gider()
    {
        var dead = new List<string>();
        var checkedLinks = 0;
        foreach (var type in Enum.GetValues<NotificationType>().Where(NotificationTypeRegistry.IsRegistered))
        {
            var link = NotificationTypeRegistry.BuildDeepLink(type, Guid.NewGuid());
            if (link == null) { continue; }

            checkedLinks++;
            if (!Exists(link.Split('?')[0]))
            {
                dead.Add($"{type}  →  {link}");
            }
        }

        checkedLinks.ShouldBeGreaterThan(20, "beklenenden az bildirim bağlantısı bulundu");
        dead.ShouldBeEmpty("Şu bildirimler var olmayan bir sayfaya götürüyor:\n" + string.Join("\n", dead));
    }

    [Fact]
    public void Kaynaktaki_Duz_Adresler_Var_Olan_Sayfaya_Gider()
    {
        var files = WebSourceFiles.HandWrittenScripts()
            .Concat(WebSourceFiles.Under(".cshtml", "src/Apya.Platform.Web/Pages", "src/Apya.Platform.Web/Components"))
            .Concat(WebSourceFiles.Under(".cs",
                "src/Apya.Platform.Web/Pages", "src/Apya.Platform.Web/Components", "src/Apya.Platform.Web/Menus",
                "src/Apya.Platform.Application", "src/Apya.Platform.Domain"))
            .Concat(WebSourceFiles.ReactSources())
            .ToList();

        var dead = new SortedSet<string>(StringComparer.Ordinal);
        var paths = new HashSet<string>(StringComparer.Ordinal);
        foreach (var file in files)
        {
            var relative = WebSourceFiles.Relative(file);
            foreach (var (number, line) in CodeLines(file))
            {
                foreach (Match m in LiteralPath.Matches(line).Concat(LowercaseHref.Matches(line)))
                {
                    var path = m.Groups["path"].Value;
                    if (NotLinks.Contains($"{relative}: {path}")) { continue; }

                    paths.Add(path);
                    var found = PageNameContext.IsMatch(line[..m.Index]) ? PageNameExists(path) : Exists(path);
                    if (!found)
                    {
                        dead.Add($"{relative}:{number}  →  {path}");
                    }
                }
            }
        }

        // Tarama bozulursa test SESSİZCE geçmemeli.
        paths.Count.ShouldBeGreaterThan(100, "beklenenden az düz adres bulundu");
        dead.ShouldBeEmpty(
            "Şu düz adreslerin karşılığında sayfa yok (bağlantı 404 verir). Adres değilse NotLinks'e ekleyin:\n" +
            string.Join("\n", dead));
    }

    /// <summary>Yorum olmayan satırlar: yorumdaki örnek adres ("eskiden /Ai/Dashboard'a gidiyordu") bağlantı değildir.</summary>
    private static IEnumerable<(int Number, string Line)> CodeLines(string file)
    {
        string? blockEnd = null;
        var number = 0;
        foreach (var line in File.ReadLines(file))
        {
            number++;
            var trimmed = line.TrimStart();
            if (blockEnd == null)
            {
                blockEnd = trimmed.StartsWith("/*", StringComparison.Ordinal) ? "*/"
                    : trimmed.StartsWith("@*", StringComparison.Ordinal) ? "*@"
                    : trimmed.StartsWith("<!--", StringComparison.Ordinal) ? "-->"
                    : null;
            }

            if (blockEnd != null)
            {
                if (trimmed.Contains(blockEnd, StringComparison.Ordinal)) { blockEnd = null; }
                continue;
            }

            if (!trimmed.StartsWith("//", StringComparison.Ordinal))
            {
                yield return (number, line);
            }
        }
    }
}
