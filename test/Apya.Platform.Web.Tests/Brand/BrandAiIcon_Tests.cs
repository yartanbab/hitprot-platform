using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Notifications;
using Shouldly;
using Xunit;

namespace Apya.Platform.Brand;

/// <summary>
/// AI ikonu = APYA işareti (kullanıcı kararı 2026-10-26).
/// İşaret YALNIZ asistanın (AI modülü / LLM çağrısı) ürettiği ya da önerdiği yerde görünür;
/// kural tabanlı eşleştirme ve sihirbazlar nötr ikon taşır. Robot / sihirli değnek / ışıltı
/// ikonu "AI" diye okunduğu için kaynağa geri dönmemeli — dönerse ya işaret ya nötr ikon seçilmeli.
/// </summary>
public class BrandAiIcon_Tests
{
    private static string Src(params string[] parts)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src");
        return Path.GetFullPath(parts.Aggregate(path, Path.Combine));
    }

    private static readonly Regex AiLookalike = new(@"fa-robot|fa-wand-magic|fa-sparkles|fa-magic\b|🤖|✨");

    [Fact]
    public void Kaynakta_robot_degnek_isilti_ikonu_kalmadi()
    {
        var roots = new[]
        {
            Src("Apya.Platform.Web", "Pages"),
            Src("Apya.Platform.Web", "Menus"),
            Src("Apya.Platform.Web", "wwwroot", "Pages"),
            Src("Apya.Platform.Web", "wwwroot", "dynamic-assets", "src"),
            Src("Apya.Platform.Domain.Shared"),
        };
        var extensions = new[] { ".cshtml", ".cs", ".js", ".jsx" };

        var offenders = roots
            .SelectMany(r => Directory.EnumerateFiles(r, "*.*", SearchOption.AllDirectories))
            .Where(f => extensions.Contains(Path.GetExtension(f)) && !f.Contains(".test.")
                        && !f.Contains($"{Path.DirectorySeparatorChar}obj{Path.DirectorySeparatorChar}")
                        && !f.Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}"))
            .Where(f => AiLookalike.IsMatch(File.ReadAllText(f)))
            .Select(f => Path.GetRelativePath(Src(), f))
            .ToList();

        offenders.ShouldBeEmpty("AI yerinde <i class=\"apya-ai-icon\">, AI olmayan yerde nötr ikon");
    }

    [Theory]
    [InlineData(NotificationType.AiWorkflowTriggered)]
    [InlineData(NotificationType.AiDraftsReady)]
    public void AI_bildirim_turleri_isareti_tasir(NotificationType type)
    {
        NotificationTypeRegistry.Get(type).Icon.ShouldBe("apya-ai-icon");
    }

    [Fact]
    public void AI_merkezi_menusu_isareti_tasir()
    {
        var menu = File.ReadAllText(Src("Apya.Platform.Web", "Menus", "PlatformNavigationResolver.cs"));
        Regex.IsMatch(menu, "\"Apya.AiCenter\",[^\\n]*icon: \"apya-ai-icon\"").ShouldBeTrue();
    }

    [Fact]
    public void AI_ikon_sinifi_isaret_maskesine_bagli()
    {
        var css = File.ReadAllText(Src("Apya.Platform.Web", "wwwroot", "css", "apya-mark.css"));
        Regex.IsMatch(css, @"\.apya-ai-icon\s*\{[^}]*mask: var\(--apya-mark-mask\)").ShouldBeTrue();
    }
}
