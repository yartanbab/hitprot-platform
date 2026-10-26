using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Marka ikonları · sekme, ana ekran ve bildirim ikonlarının yolları kaynaktan kilitlenir.
/// Kırık ikon yolu hata vermez: tarayıcı sessizce varsayılan ikonu (ya da hiçbir şeyi) gösterir,
/// eksik dosya ise service worker kurulumunu tümden düşürür (precache atomiktir).
/// </summary>
public class BrandIconContract_Tests
{
    private static string WebRoot(params string[] parts)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynak depodan okunur.
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src", "Apya.Platform.Web");
        foreach (var part in parts)
        {
            path = Path.Combine(path, part);
        }

        return Path.GetFullPath(path);
    }

    private static string ReadSource(params string[] parts)
    {
        var path = WebRoot(parts);
        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {path}");
        return File.ReadAllText(path);
    }

    [Fact]
    public void Ikon_yollari_wwwroot_ta_var()
    {
        var sources = new[]
        {
            ReadSource("wwwroot", "manifest.webmanifest"),
            ReadSource("wwwroot", "sw.js"),
            ReadSource("wwwroot", "Pages", "Notifications", "notification-bell.js"),
            ReadSource("Pages", "Shared", "_ApyaIcons.cshtml"),
        };

        var paths = sources
            .SelectMany(s => Regex.Matches(s, @"/brand/[A-Za-z0-9._-]+\.(?:png|svg|ico)").Select(m => m.Value))
            .Distinct()
            .ToList();

        paths.ShouldNotBeEmpty();
        foreach (var path in paths)
        {
            File.Exists(WebRoot(("wwwroot" + path).Split('/'))).ShouldBeTrue($"{path} wwwroot'ta yok.");
        }
    }

    [Fact]
    public void Manifest_hem_normal_hem_maskable_png_ikon_tasir()
    {
        using var manifest = JsonDocument.Parse(ReadSource("wwwroot", "manifest.webmanifest"));
        var icons = manifest.RootElement.GetProperty("icons").EnumerateArray().ToList();

        // Android ana ekranı SVG'yi her yerde kabul etmez; maskable ikon kırpılmasın diye tam kare olmalı.
        icons.ShouldContain(i => i.GetProperty("type").GetString() == "image/png" && i.GetProperty("purpose").GetString() == "any");
        icons.ShouldContain(i => i.GetProperty("type").GetString() == "image/png" && i.GetProperty("purpose").GetString() == "maskable");
    }

    [Theory]
    [InlineData("Pages", "Shared", "Components", "ApyaThemeHead", "Default.cshtml")]
    [InlineData("Pages", "Account", "_ApyaAccountLayout.cshtml")]
    [InlineData("Pages", "Legal", "_LegalLayout.cshtml")]
    [InlineData("Pages", "F", "Index.cshtml")]
    [InlineData("Pages", "Hibeler", "_PublicLayout.cshtml")]
    [InlineData("Pages", "Paylasim", "Index.cshtml")]
    [InlineData("Pages", "Share", "Index.cshtml")]
    [InlineData("Pages", "Invoices", "Print.cshtml")]
    public void Sayfa_ortak_ikon_parcasini_kullanir(params string[] parts)
    {
        ReadSource(parts).ShouldContain("<partial name=\"_ApyaIcons\" />");
    }

    /// <summary>
    /// LeptonX Lite gömülü bir /favicon.ico taşır ve MapAbpStaticAssets onu wwwroot kökündekinden
    /// önce sunar. Kökteki dosya hiç okunmaz; istek /brand altındakine çevrilmelidir.
    /// </summary>
    [Fact]
    public void Kok_favicon_istegi_marka_ikonuna_cevrilir()
    {
        File.Exists(WebRoot("wwwroot", "favicon.ico")).ShouldBeFalse("Kökteki favicon.ico LeptonX'inkinin gölgesinde kalır; /brand altına konmalı.");
        ReadSource("PlatformWebModule.cs").ShouldContain("ctx.Request.Path = \"/brand/favicon.ico\";");
    }
}
