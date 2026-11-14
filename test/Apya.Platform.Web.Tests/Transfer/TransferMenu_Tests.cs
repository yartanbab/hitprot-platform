using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Transfer;

/// <summary>
/// "Excel'e aktar" düğmelerinin yanındaki ortak menü (CSV + Tüm aktarımlar). Menüyü betik kurar
/// (<c>apya-transfer-menu.js</c>); ekranın payı iki sözleşmedir: düğme işaretlidir ve adresi betikle
/// kuran ekran istenen biçimi adrese ekler. Biri unutulursa CSV seçeneği o ekranda sessizce Excel verir.
/// </summary>
public class TransferMenu_Tests : PlatformWebTestBase
{
    private static readonly string Pages = Path.Combine(Directory.GetCurrentDirectory(),
        "..", "..", "..", "..", "..", "src", "Apya.Platform.Web", "Pages");

    // Menü almayan düğmeler, gerekçesiyle.
    private static readonly string[] WithoutMenu =
    [
        // Görünüm seçici şeridinin simge düğmesi; bölünmüş düğme şeridi bozar. CSV çalışma alanından alınır.
        Path.Combine("Projects", "Index.cshtml"),
    ];

    [Fact]
    public void Excel_dugmesi_olan_her_ekran_menu_icin_isaretli()
    {
        var unmarked = Directory.EnumerateFiles(Pages, "*.*", SearchOption.AllDirectories)
            .Where(f => f.EndsWith(".cshtml", StringComparison.Ordinal) || f.EndsWith(".js", StringComparison.Ordinal))
            .Where(f => !WithoutMenu.Any(f.EndsWith))
            .Select(f => (File: Path.GetRelativePath(Pages, f), Text: File.ReadAllText(f)))
            .Where(f => f.Text.Contains("Export:ExcelButton", StringComparison.Ordinal))
            .Where(f => Regex.Matches(f.Text, "Export:ExcelButton").Count > Regex.Matches(f.Text, "data-transfer-export").Count)
            .Select(f => f.File)
            .ToList();

        unmarked.ShouldBeEmpty("Bu dosyalarda \"Excel'e aktar\" düğmesi data-transfer-export taşımıyor; CSV menüsü çıkmaz.");
    }

    [Fact]
    public void Adresi_betikle_kuran_ekran_bicimi_adrese_ekler()
    {
        var silent = Directory.EnumerateFiles(Pages, "*.*", SearchOption.AllDirectories)
            .Where(f => f.EndsWith(".cshtml", StringComparison.Ordinal) || f.EndsWith(".js", StringComparison.Ordinal))
            .Select(f => (File: Path.GetRelativePath(Pages, f), Text: File.ReadAllText(f)))
            .Where(f => Regex.IsMatch(f.Text, @"new URLSearchParams\(\{ handler: '\w*Excel'"))
            .Where(f => !f.Text.Contains("window.apyaExportFormat", StringComparison.Ordinal))
            .Select(f => f.File)
            .ToList();

        silent.ShouldBeEmpty("Bu ekranlar dışa aktarma adresini betikle kuruyor ama window.apyaExportFormat'ı eklemiyor; CSV seçeneği Excel indirir.");
    }

    [Fact]
    public async Task Menu_betigi_her_sayfaya_yuklenir_ve_form_dugmesinden_csv_iner()
    {
        var html = await GetResponseAsStringAsync("/Admin/Billing");
        html.ShouldContain("data-transfer-export");

        // Süzgeç formundaki düğme: menü forma gizli "format" alanı koyar, form GET ile gider.
        var csv = await GetResponseAsync("/Admin/Billing?handler=Excel&format=csv");
        csv.Content.Headers.ContentType!.MediaType.ShouldBe("text/csv");

        var script = File.ReadAllText(Path.Combine(Pages, "..", "PlatformWebModule.cs"));
        script.ShouldContain("bundle.AddFiles(\"/js/apya-transfer-menu.js\")");
    }
}
