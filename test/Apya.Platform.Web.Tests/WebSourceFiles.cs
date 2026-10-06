using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace Apya.Platform;

/// <summary>
/// Kaynak dosyayı OKUYAN sözleşme testlerinin ortak dosya bulucusu. Derleyicinin görmediği
/// bağlar (betikteki yerelleştirme anahtarı, enum'u indeksle okuyan dizi) kaynak üzerinden ölçülür.
/// </summary>
internal static class WebSourceFiles
{
    private static readonly string[] SkippedFolders = { "bin", "obj", "node_modules", "libs", "dynamic-assets", "Migrations" };

    public static string RepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (Directory.Exists(Path.Combine(dir.FullName, "src", "Apya.Platform.Web")))
            {
                return dir.FullName;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Depo kökü bulunamadı (src/Apya.Platform.Web).");
    }

    public static string Relative(string path) =>
        Path.GetRelativePath(RepoRoot(), path).Replace('\\', '/');

    /// <summary>Verilen kökler altındaki dosyalar; derleme çıktısı ve bağımlılık klasörleri atlanır.</summary>
    public static IEnumerable<string> Under(string extension, params string[] relativeRoots)
    {
        var root = RepoRoot();
        foreach (var relative in relativeRoots)
        {
            var dir = Path.Combine(root, relative.Replace('/', Path.DirectorySeparatorChar));
            if (!Directory.Exists(dir))
            {
                continue;
            }

            foreach (var file in Directory.EnumerateFiles(dir, "*" + extension, SearchOption.AllDirectories))
            {
                var parts = Path.GetRelativePath(root, file).Split(Path.DirectorySeparatorChar);
                if (!parts.Any(p => SkippedFolders.Contains(p, StringComparer.OrdinalIgnoreCase)))
                {
                    yield return file;
                }
            }
        }
    }

    /// <summary>
    /// Elle yazılmış betikler: sayfa betikleri + <c>wwwroot/js</c> altındaki ortak betikler.
    /// Vite'ın ürettiği demetler (manifest'te listelenenler) ve küçültülmüş kütüphaneler dışarıda:
    /// onlarda <c>l(</c> küçültücünün verdiği rastgele bir addır.
    /// </summary>
    public static IEnumerable<string> HandWrittenScripts()
    {
        foreach (var file in Under(".js", "src/Apya.Platform.Web/Pages", "src/Apya.Platform.Web/Components"))
        {
            yield return file;
        }

        var jsFolder = Path.Combine(RepoRoot(), "src", "Apya.Platform.Web", "wwwroot", "js");
        var built = BuiltBundleNames(jsFolder);
        foreach (var file in Directory.EnumerateFiles(jsFolder, "*.js", SearchOption.TopDirectoryOnly))
        {
            var name = Path.GetFileName(file);
            if (!built.Contains(name) && !name.EndsWith(".min.js", StringComparison.OrdinalIgnoreCase))
            {
                yield return file;
            }
        }
    }

    private static HashSet<string> BuiltBundleNames(string jsFolder)
    {
        var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var manifest = Path.Combine(jsFolder, ".vite", "manifest.json");
        using var doc = JsonDocument.Parse(File.ReadAllText(manifest));
        foreach (var entry in doc.RootElement.EnumerateObject())
        {
            if (entry.Value.TryGetProperty("file", out var file))
            {
                names.Add(file.GetString()!);
            }
        }

        return names;
    }
}
