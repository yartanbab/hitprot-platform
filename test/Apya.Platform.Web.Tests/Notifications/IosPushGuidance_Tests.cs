using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Notifications;

/// <summary>
/// B-14 · iPhone/iPad Safari sekmesinde bildirim API'si yok; tercih ekranı "desteklemiyor" yerine ana ekrana ekleme
/// yönergesi gösterir (yalnız iOS'ta ve uygulama yüklü değilken).
/// </summary>
public class IosPushGuidance_Tests
{
    private static string Src(params string[] parts) =>
        File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(), Path.Combine(parts)));

    [Fact]
    public void Tercih_ekrani_iOS_icin_ana_ekrana_ekle_yonergesi_gosterir()
    {
        var js = Src("src", "Apya.Platform.Web", "Pages", "Notifications", "Index.js");
        js.ShouldContain("window.matchMedia('(display-mode: standalone)').matches");
        js.ShouldContain("l(iosNotInstalled ? 'Notifications:Desktop:StatusIosInstall' : 'Notifications:Desktop:StatusUnsupported')");

        foreach (var lang in new[] { "tr", "en" })
        {
            Src("src", "Apya.Platform.Domain.Shared", "Localization", "Platform", lang + ".json")
                .ShouldContain("\"Notifications:Desktop:StatusIosInstall\"");
        }
    }
}
