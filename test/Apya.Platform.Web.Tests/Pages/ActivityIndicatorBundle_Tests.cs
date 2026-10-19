using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Y-01 · İşlem göstergesi global demette ve istek atan betiklerden ÖNCE yüklenir (XHR/fetch'i
/// sarmalar); stili kabukta.
/// </summary>
public class ActivityIndicatorBundle_Tests
{
    [Fact]
    public void Gosterge_global_demette_ve_stili_kabukta()
    {
        var root = WebSourceFiles.RepoRoot();
        var module = File.ReadAllText(Path.Combine(root, "src", "Apya.Platform.Web", "PlatformWebModule.cs"));
        var at = module.IndexOf("\"/js/apya-activity.js\"");
        at.ShouldBeGreaterThan(0);
        at.ShouldBeGreaterThan(module.IndexOf("\"/js/apya-busy.js\""));
        at.ShouldBeLessThan(module.IndexOf("\"/js/apya-dirty-guard.js\""));

        var css = File.ReadAllText(Path.Combine(root, "src", "Apya.Platform.Web", "wwwroot", "css", "apya-shell.css"));
        css.ShouldContain(".apya-activity.is-active");
        css.ShouldContain("[data-apya-pending]::after");
        css.ShouldContain("prefers-reduced-motion");
    }
}
