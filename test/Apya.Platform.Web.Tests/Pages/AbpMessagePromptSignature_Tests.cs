using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// abp.message.prompt imzasını kaynak üzerinden kilitler (2026-09-28 UX denetimi, GRH-01).
/// </summary>
public class AbpMessagePromptSignature_Tests
{
    /// <summary>
    /// ABP imzası <c>abp.message.prompt(message, titleOrOptions, callback)</c>: seçenekler
    /// İKİNCİ argüman. <c>prompt(msg, '', { input: 'select' })</c> nesneyi geri çağrı sanır,
    /// açılır liste yerine metin kutusu çıkar ve onayda "r is not a function" atıp hiçbir
    /// istek göndermez — hibe danışman atama, itiraz görüşü ve rapor durumu böyle kilitliydi.
    /// </summary>
    [Fact]
    public void Prompt_secenekleri_ikinci_argumanda_verilir()
    {
        var pattern = new Regex(@"abp\.message\.prompt\([^;]*?,\s*(''|"""")\s*,\s*\{", RegexOptions.Singleline);
        var offenders = new List<string>();

        foreach (var file in ScriptFiles())
        {
            var text = File.ReadAllText(file);
            foreach (Match m in pattern.Matches(text))
            {
                var line = text.Take(m.Index).Count(c => c == '\n') + 1;
                offenders.Add($"{Relative(file)}:{line}");
            }
        }

        offenders.ShouldBeEmpty(
            "abp.message.prompt(msg, '', {...}) seçenekleri geri çağrı sanır; " +
            "abp.message.prompt(msg, {...}) yazın:" +
            Environment.NewLine + string.Join(Environment.NewLine, offenders));
    }

    /// <summary>El yazısı betikler: sayfa betikleri + wwwroot/js (Vite demetleri ve libs hariç).</summary>
    private static IEnumerable<string> ScriptFiles()
    {
        var root = WebRoot();
        var pages = Directory.EnumerateFiles(Path.Combine(root, "Pages"), "*.js", SearchOption.AllDirectories);
        var js = Directory.EnumerateFiles(Path.Combine(root, "wwwroot", "js"), "*.js", SearchOption.TopDirectoryOnly);
        var pageScripts = Directory.Exists(Path.Combine(root, "wwwroot", "Pages"))
            ? Directory.EnumerateFiles(Path.Combine(root, "wwwroot", "Pages"), "*.js", SearchOption.AllDirectories)
            : Enumerable.Empty<string>();
        return pages.Concat(js).Concat(pageScripts);
    }

    private static string Relative(string file) => Path.GetRelativePath(WebRoot(), file);

    private static string WebRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Web");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Apya.Platform.Web proje kökü bulunamadı.");
    }
}
