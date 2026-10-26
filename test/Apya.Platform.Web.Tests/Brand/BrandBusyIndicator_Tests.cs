using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Web.Brand;
using Shouldly;
using Xunit;

namespace Apya.Platform.Brand;

/// <summary>
/// Bekleme göstergeleri (kullanıcı kararı 2026-10-26: "tüm spinner'lar APYA işareti").
/// Değişim tek bir CSS katmanında (apya-mark.css "YÜKLENİYOR") yapıldığı için sessizce
/// geri kayabilir: kural silinir ya da yeni bir dönen halka eklenir, hiçbir ekran hata vermez.
/// Gezinme katmanının davranışı vitest'te (src/test/apyaActivity.test.js).
/// </summary>
public class BrandBusyIndicator_Tests
{
    private static string WebPath(params string[] parts)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src", "Apya.Platform.Web");
        return Path.GetFullPath(parts.Aggregate(path, Path.Combine));
    }

    private static string Read(params string[] parts)
    {
        var path = WebPath(parts);
        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {path}");
        return File.ReadAllText(path);
    }

    [Fact]
    public void Tum_bekleme_gostergeleri_isaret_maskesine_bagli()
    {
        var css = Read("wwwroot", "css", "apya-mark.css");

        css.ShouldContain("--apya-busy-mask: url('/brand/apya-isaret-dusunuyor.svg')");
        // Dönen her FA ikonu, Bootstrap spinner'ları ve ABP meşgul katmanı maskelenir.
        Regex.IsMatch(css, @"\.fa-spin::before\s*\{[^}]*mask: var\(--apya-busy-mask\)").ShouldBeTrue();
        Regex.IsMatch(css, @"\.spinner-grow\s*\{[^}]*mask: var\(--apya-busy-mask\)").ShouldBeTrue();
        Regex.IsMatch(css, @"\.abp-block-area\.abp-block-area-busy:before\s*\{[^}]*mask: var\(--apya-busy-mask\)").ShouldBeTrue();
        // İşaret döndürülmez (kılavuz).
        Regex.IsMatch(css, @"\.fa-spin\s*\{\s*animation: none !important;").ShouldBeTrue();

        Regex.IsMatch(Read("wwwroot", "css", "apya-shell.css"), @"\[data-apya-pending\]::after\s*\{[^}]*mask: var\(--apya-busy-mask\)")
            .ShouldBeTrue("tıklanan düğmenin bekleme simgesi de işaret olmalı");
    }

    [Fact]
    public void Dusunuyor_maskesi_paketteki_geometri_ve_zamanlamayla_ayni()
    {
        var svg = Read("wwwroot", "brand", "apya-isaret-dusunuyor.svg");

        foreach (var angle in ApyaMarkSvg.RayAngles)
        {
            svg.ShouldContain($"rotate({angle} 50 50)");
        }
        Regex.Matches(svg, "<line ").Count.ShouldBe(13);
        svg.ShouldContain("animation:t 1.8s ease-in-out infinite");
        svg.ShouldContain("animation-delay:0.660s"); // 12. ışın: 12 × 55 ms
        svg.ShouldContain($"points=\"{ApyaMarkSvg.NeedleNorth}\"");
        svg.ShouldContain($"points=\"{ApyaMarkSvg.NeedleSouth}\"");
    }

    [Fact]
    public void Gezinme_katmani_metni_yerellestirmeden_gelir()
    {
        var tr = Read("..", "Apya.Platform.Domain.Shared", "Localization", "Platform", "tr.json");
        tr.ShouldContain("\"Shell:Loading\": \"Yükleniyor…\"");
        Read("wwwroot", "js", "apya-activity.js").ShouldContain("localize('Shell:Loading', 'Platform')");
    }

    [Fact]
    public void React_kaynaginda_donen_halka_kalmadi()
    {
        var src = WebPath("wwwroot", "dynamic-assets", "src");
        var offenders = Directory.EnumerateFiles(src, "*.jsx", SearchOption.AllDirectories)
            .Concat(Directory.EnumerateFiles(src, "*.js", SearchOption.AllDirectories))
            .Where(f => !f.Contains(".test."))
            .Where(f => File.ReadAllText(f).Contains("animate-spin"))
            .Select(f => Path.GetRelativePath(src, f))
            .ToList();

        offenders.ShouldBeEmpty("bekleme göstergesi <ApyaMark state=\"thinking\" /> olmalı");
    }
}
