using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Betiklerin çağırdığı her sunucu vekili ve metodu gerçekten var.
///
/// <para>Sayfa betikleri uygulama servislerine ABP'nin dinamik JS vekiliyle ulaşır:
/// <c>apya.platform.grants.grantImplementation.setSectionStatus(…)</c>. Yol, servisin AD ALANINDAN
/// ve sınıf adından; metot, C# metodunun adından üretilir. Sunucuda sınıf taşınır ya da metot
/// yeniden adlandırılırsa derleme yeşil kalır, betik ise çalışma anında "is not a function"
/// verir — düğme "hiçbir şey yapmıyor" görünür.</para>
/// </summary>
public class ScriptProxyCalls_Tests : PlatformWebTestBase
{
    // var service = apya.platform.grants.grantImplementation;
    private static readonly Regex Binding = new(
        @"\b(?:var|let|const)\s+(?<var>[\w$]+)\s*=\s*(?<path>apya\.platform(?:\.\w+)+)\s*[;,\r\n]",
        RegexOptions.Compiled);

    // apya.platform.grants.grantCall.delete(…)
    private static readonly Regex DirectCall = new(
        @"(?<![\w$.])(?<path>apya\.platform(?:\.\w+)+)\.(?<method>\w+)\s*\(", RegexOptions.Compiled);

    private static string Camel(string s) => char.ToLowerInvariant(s[0]) + s[1..];

    /// <summary>
    /// ABP'nin vekil adlandırması: ad alanı parçaları + "AppService"siz sınıf adı (hepsi camelCase);
    /// metot adı "Async"siz ve camelCase.
    /// </summary>
    private static Dictionary<string, HashSet<string>> ServerProxies()
    {
        var map = new Dictionary<string, HashSet<string>>(StringComparer.Ordinal);
        var types = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => a.GetName().Name?.StartsWith("Apya.Platform", StringComparison.Ordinal) == true)
            .SelectMany(a => a.GetTypes())
            .Where(t => t.IsClass && !t.IsAbstract && t.Namespace != null
                        && t.Name.EndsWith("AppService", StringComparison.Ordinal)
                        && typeof(IRemoteService).IsAssignableFrom(t));

        foreach (var type in types)
        {
            var path = string.Join('.', type.Namespace!.Split('.').Select(Camel))
                       + "." + Camel(type.Name[..^"AppService".Length]);
            if (!map.TryGetValue(path, out var methods))
            {
                map[path] = methods = new HashSet<string>(StringComparer.Ordinal);
            }

            foreach (var method in type.GetMethods(BindingFlags.Public | BindingFlags.Instance)
                         .Where(m => !m.IsSpecialName && m.DeclaringType != typeof(object)))
            {
                methods.Add(Camel(method.Name.EndsWith("Async", StringComparison.Ordinal)
                    ? method.Name[..^"Async".Length]
                    : method.Name));
            }
        }

        return map;
    }

    [Fact]
    public void Betiklerin_Cagirdigi_Her_Vekil_Ve_Metot_Sunucuda_Var()
    {
        var proxies = ServerProxies();
        proxies.Count.ShouldBeGreaterThan(50, "beklenenden az uygulama servisi bulundu; yansıma bozulmuş olabilir");

        var problems = new List<string>();
        var calls = 0;

        foreach (var file in WebSourceFiles.HandWrittenScripts())
        {
            var text = File.ReadAllText(file);
            if (!text.Contains("apya.platform.", StringComparison.Ordinal)) { continue; }

            var where = WebSourceFiles.Relative(file);
            string At(int index) => $"{where}:{text.Take(index).Count(c => c == '\n') + 1}";

            void Check(IEnumerable<string> paths, string method, int index)
            {
                calls++;
                var known = paths.Where(proxies.ContainsKey).ToList();
                if (known.Count == 0)
                {
                    problems.Add($"{At(index)}  {paths.First()} — böyle bir vekil yok");
                }
                else if (!known.Any(p => proxies[p].Contains(method)))
                {
                    problems.Add($"{At(index)}  {known[0]}.{method}() — serviste böyle bir metot yok");
                }
            }

            // Aynı değişken adı dosyanın iki yerinde iki ayrı servise bağlanabilir: biri tutuyorsa yeter.
            var bound = Binding.Matches(text)
                .GroupBy(m => m.Groups["var"].Value)
                .ToDictionary(g => g.Key, g => g.Select(m => m.Groups["path"].Value).Distinct().ToList());

            foreach (var (variable, paths) in bound)
            {
                var call = new Regex(@"(?<![\w$.])" + Regex.Escape(variable) + @"\.(?<method>\w+)\s*\(");
                foreach (Match m in call.Matches(text))
                {
                    Check(paths, m.Groups["method"].Value, m.Index);
                }
            }

            foreach (Match m in DirectCall.Matches(text))
            {
                Check(new[] { m.Groups["path"].Value }, m.Groups["method"].Value, m.Index);
            }
        }

        // Tarama bozulursa test SESSİZCE geçmemeli.
        calls.ShouldBeGreaterThan(200, "beklenenden az vekil çağrısı bulundu; tarama bozulmuş olabilir");

        problems.Distinct().ShouldBeEmpty(
            "Şu çağrıların sunucuda karşılığı yok — betik çalışma anında hata verir:\n" +
            string.Join("\n", problems.Distinct()));
    }
}
