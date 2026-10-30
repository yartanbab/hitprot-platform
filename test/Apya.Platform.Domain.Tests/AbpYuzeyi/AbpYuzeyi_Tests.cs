using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.AbpYuzeyi;

/// <summary>
/// SÖZLEŞME: bu depoda kullanılan ABP (<c>Volo.*</c>) yüzeyi izinli listeyle sınırlı kalır.
///
/// <para>ABP'den çıkış yeni depoda (<c>apya-platform-next</c>, ADR-0001) yapılıyor ve bu deponun son hali
/// sonunda oraya kopyalanacak. Çıkış hattı kullanılan her ad alanının ve paketin karşılığını kendi kodu
/// olarak yazar; burada yüzey sessizce büyürse hem kopya hem çıkış işi büyür. Listede olmayan yeni bir
/// <c>using Volo.*</c> ad alanı ya da <c>Volo.*</c> paket başvurusu bu testi düşürür.
/// Liste: <c>docs/abp-cikis/izinli-yuzey.txt</c>.</para>
///
/// <para>Kapsam bilerek DAR: yalnız <c>using</c> yönergeleri ve csproj paket başvuruları taranır (envanter
/// de böyle ölçüldü). Aynı ad alanındaki yeni bir TİP yakalanmaz; tam nitelikli satır içi kullanım taranmaz.</para>
/// </summary>
public class AbpYuzeyi_Tests
{
    private static readonly string[] SkippedDirectories = { "bin", "obj", "node_modules", "Migrations", "wwwroot", ".git" };

    private static readonly Regex UsingDirective = new(
        @"^\s*(?:global\s+)?using\s+(?:static\s+)?(Volo(?:\.[A-Za-z_]\w*)+)\s*;",
        RegexOptions.Multiline | RegexOptions.Compiled);

    private static readonly Regex PackageReference = new(@"Include=""(Volo\.[^""]+)""", RegexOptions.Compiled);

    private const string HowTo =
        "Çıkış hattı (apya-platform-next) bu yüzeyin karşılığını kendi kodu olarak yazıyor; yeni bir ABP bağımlılığı o işi büyütür. "
        + "Önce ABP'siz ya da listedeki bir ad alanıyla çözülüp çözülemeyeceğine bak. Gerçekten gerekiyorsa docs/abp-cikis/izinli-yuzey.txt'ye "
        + "ekle (sıralı) ve apya-platform-next'te uyumluluk işi aç.";

    [Fact]
    public void Kullanilan_ABP_ad_alanlari_izinli_listededir()
    {
        var allowed = ReadAllowList().Namespaces;
        var firstFile = new SortedDictionary<string, string>(StringComparer.Ordinal);

        foreach (var file in Files(".cs"))
        {
            foreach (Match match in UsingDirective.Matches(File.ReadAllText(file)))
            {
                var ns = match.Groups[1].Value;
                if (!allowed.Contains(ns) && !firstFile.ContainsKey(ns))
                {
                    firstFile[ns] = Relative(file);
                }
            }
        }

        firstFile
            .Select(x => $"{x.Key}  (örn. {x.Value})")
            .ShouldBeEmpty("İzinli listede olmayan ABP ad alanı kullanıldı. " + HowTo);
    }

    [Fact]
    public void Basvurulan_ABP_paketleri_izinli_listededir()
    {
        var allowed = ReadAllowList().Packages;
        var firstFile = new SortedDictionary<string, string>(StringComparer.Ordinal);

        foreach (var file in Files(".csproj"))
        {
            foreach (Match match in PackageReference.Matches(File.ReadAllText(file)))
            {
                var package = match.Groups[1].Value;
                if (!allowed.Contains(package) && !firstFile.ContainsKey(package))
                {
                    firstFile[package] = Relative(file);
                }
            }
        }

        firstFile
            .Select(x => $"{x.Key}  (örn. {x.Value})")
            .ShouldBeEmpty("İzinli listede olmayan ABP paketi eklendi. " + HowTo);
    }

    private static (HashSet<string> Namespaces, HashSet<string> Packages) ReadAllowList()
    {
        var namespaces = new HashSet<string>(StringComparer.Ordinal);
        var packages = new HashSet<string>(StringComparer.Ordinal);
        HashSet<string>? current = null;

        foreach (var raw in File.ReadAllLines(Path.Combine(RepoRoot(), "docs", "abp-cikis", "izinli-yuzey.txt")))
        {
            var line = raw.Trim();

            if (line.Length == 0 || line.StartsWith('#'))
            {
                continue;
            }

            if (line == "[ad-alanlari]")
            {
                current = namespaces;
            }
            else if (line == "[paketler]")
            {
                current = packages;
            }
            else
            {
                (current ?? throw new InvalidDataException("izinli-yuzey.txt: giriş bir bölüm başlığından önce geldi: " + line)).Add(line);
            }
        }

        namespaces.ShouldNotBeEmpty("izinli-yuzey.txt: [ad-alanlari] bölümü boş ya da okunamadı.");
        packages.ShouldNotBeEmpty("izinli-yuzey.txt: [paketler] bölümü boş ya da okunamadı.");

        return (namespaces, packages);
    }

    /// <summary><c>src</c> ve <c>test</c> altındaki, uzantısı <paramref name="extension"/> olan dosyalar; derleme çıktıları ve migration'lar atlanır.</summary>
    private static IEnumerable<string> Files(string extension)
    {
        var root = RepoRoot();
        var pending = new Stack<string>();
        pending.Push(Path.Combine(root, "src"));
        pending.Push(Path.Combine(root, "test"));

        while (pending.Count > 0)
        {
            var directory = pending.Pop();

            foreach (var subdirectory in Directory.EnumerateDirectories(directory))
            {
                if (Array.IndexOf(SkippedDirectories, Path.GetFileName(subdirectory)) < 0)
                {
                    pending.Push(subdirectory);
                }
            }

            foreach (var file in Directory.EnumerateFiles(directory))
            {
                // Windows'ta "*.cs" deseni ".csproj"u da eşleyebildiği için uzantı elle karşılaştırılır.
                if (file.EndsWith(extension, StringComparison.OrdinalIgnoreCase))
                {
                    yield return file;
                }
            }
        }
    }

    private static string Relative(string path) => Path.GetRelativePath(RepoRoot(), path).Replace('\\', '/');

    private static string RepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (Directory.Exists(Path.Combine(dir.FullName, "src", "Apya.Platform.Domain")))
            {
                return dir.FullName;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Depo kökü bulunamadı.");
    }
}
