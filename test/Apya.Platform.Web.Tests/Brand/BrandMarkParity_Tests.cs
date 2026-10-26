using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Web.Brand;
using Shouldly;
using Xunit;

namespace Apya.Platform.Brand;

/// <summary>
/// APYA işareti üç yerde üretilir (C# tag helper, jQuery apya.mark, React ApyaMark).
/// Biri tek başına değişirse işaret sayfadan sayfaya farklı çizilir ve bunu hiçbir şey
/// söylemez → geometri sabitleri kaynaktan okunup C#'takiyle karşılaştırılır.
/// </summary>
public class BrandMarkParity_Tests
{
    private static string ReadSource(params string[] parts)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynak depodan okunur.
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src", "Apya.Platform.Web");
        foreach (var part in parts)
        {
            path = Path.Combine(path, part);
        }

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    public static IEnumerable<object[]> Sources() => new[]
    {
        new object[] { "wwwroot/js/apya-mark.js" },
        new object[] { "wwwroot/dynamic-assets/src/components/brand/ApyaMark.jsx" },
    };

    private static List<string> ArrayValues(string source, string name)
    {
        // \b: PRINT_NEEDLE_NORTH içindeki NEEDLE_NORTH'u yakalamasın.
        var match = Regex.Match(source, @"\b(?:" + name + @")\s*=\s*\[(?<body>[^\]]*)\]");
        match.Success.ShouldBeTrue($"{name} dizisi bulunamadı.");
        return Regex.Matches(match.Groups["body"].Value, "'([^']*)'").Select(m => m.Groups[1].Value).ToList();
    }

    private static string Constant(string source, string name)
    {
        var match = Regex.Match(source, @"\b(?:" + name + @")\s*=\s*'([^']*)'");
        match.Success.ShouldBeTrue($"{name} sabiti bulunamadı.");
        return match.Groups[1].Value;
    }

    [Theory]
    [MemberData(nameof(Sources))]
    public void Geometri_sabitleri_sunucudakiyle_ayni(string relativePath)
    {
        var source = ReadSource(relativePath.Split('/'));

        ArrayValues(source, "RAY_ANGLES").ShouldBe(ApyaMarkSvg.RayAngles);
        ArrayValues(source, "LISTEN_DURATIONS").ShouldBe(ApyaMarkSvg.ListenDurations);
        ArrayValues(source, "STATES|APYA_MARK_STATES").ShouldBe(ApyaMarkSvg.States);
        Constant(source, "NEEDLE_NORTH").ShouldBe(ApyaMarkSvg.NeedleNorth);
        Constant(source, "NEEDLE_SOUTH").ShouldBe(ApyaMarkSvg.NeedleSouth);
        Constant(source, "PRINT_NEEDLE_NORTH").ShouldBe(ApyaMarkSvg.PrintNeedleNorth);
        Constant(source, "PRINT_NEEDLE_SOUTH").ShouldBe(ApyaMarkSvg.PrintNeedleSouth);
        Constant(source, "MICRO_NEEDLE_NORTH").ShouldBe(ApyaMarkSvg.MicroNeedleNorth);
        Constant(source, "MICRO_NEEDLE_SOUTH").ShouldBe(ApyaMarkSvg.MicroNeedleSouth);
    }

    [Fact]
    public void Isaret_betigi_ve_stili_global_pakette()
    {
        var module = ReadSource("PlatformWebModule.cs");
        module.ShouldContain("bundle.AddFiles(\"/css/apya-mark.css\");");
        module.ShouldContain("bundle.AddFiles(\"/js/apya-mark.js\");");
    }
}
