using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Menus;

/// <summary>
/// Kenar çubuğu rozetleri menü öğelerine ADLA bağlanır
/// (<c>addBadge('Apya.Grants.Requests', …)</c>). <c>addBadge</c> çapayı bulamazsa
/// SESSİZCE çıkar: hata yok, log yok, rozet yok.
///
/// <para>🔴 Bu tuzak iki kez yaşandı. Önce "Apya.Work.Tasks" menüden kalkınca
/// geciken görev rozeti düştü; sonra tur 22'de "Apya.Grants.Applications" ve
/// "Apya.Grants.Interests" yeniden adlandırılınca bekleyen başvuru/talep
/// rozetleri aylarca hiç basılmadı (2026-09-17 denetiminde bulundu).</para>
///
/// <para>Test, JS'teki her çapa adının menü ağacını üreten kaynaklarda gerçekten
/// tanımlı olduğunu doğrular. Menü adı değişirse JS'i güncellemeyi unutmak artık
/// kırmızı test verir.</para>
/// </summary>
public class SidebarBadgeAnchor_Tests
{
    private static string FindRepoFile(params string[] relativeSegments)
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(new[] { dir.FullName }.Concat(relativeSegments).ToArray());
            if (File.Exists(candidate)) { return candidate; }
            dir = dir.Parent;
        }

        return null;
    }

    private static List<string> ExtractBadgeAnchors(string source)
    {
        // Yalnız ÇAĞRILAR: `function addBadge(name, …)` tanımı eşleşmez.
        return Regex.Matches(source, @"addBadge\('([^']+)'")
            .Select(m => m.Groups[1].Value)
            .Distinct()
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToList();
    }

    [Fact]
    public void Rozet_capalarinin_hepsi_menude_tanimli()
    {
        var jsPath = FindRepoFile("src", "Apya.Platform.Web", "wwwroot", "js", "apya-sidebar-shell.js");
        var resolverPath = FindRepoFile("src", "Apya.Platform.Web", "Menus", "PlatformNavigationResolver.cs");
        var adminLinksPath = FindRepoFile("src", "Apya.Platform.Web", "Menus", "PlatformAdminLinks.cs");

        // Dosya bulunamazsa test SESSİZCE geçmemeli.
        jsPath.ShouldNotBeNull("apya-sidebar-shell.js bulunamadı; test yolu bozulmuş olabilir.");
        resolverPath.ShouldNotBeNull("PlatformNavigationResolver.cs bulunamadı.");
        adminLinksPath.ShouldNotBeNull("PlatformAdminLinks.cs bulunamadı.");

        var anchors = ExtractBadgeAnchors(File.ReadAllText(jsPath));

        // Rozetler tümden kaldırıldıysa da haberimiz olsun.
        anchors.Count.ShouldBeGreaterThan(0, "apya-sidebar-shell.js'te hiç addBadge çağrısı yok.");

        var menuSource = File.ReadAllText(resolverPath) + File.ReadAllText(adminLinksPath);

        foreach (var anchor in anchors)
        {
            menuSource.ShouldContain(
                $"\"{anchor}\"",
                Case.Sensitive,
                $"'{anchor}' rozet çapası menüde tanımlı değil — rozet sessizce hiçbir yere basılmaz.");
        }
    }
}
