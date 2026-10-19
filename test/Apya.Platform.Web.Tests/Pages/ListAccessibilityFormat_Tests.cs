using System.IO;
using System.Linq;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>QA turu 19.10 · liste erişilebilirliği ve tarih biçimi (betik/şablon pinleri).</summary>
public class ListAccessibilityFormat_Tests
{
    private static string Web(params string[] parts) =>
        File.ReadAllText(Path.Combine(new[] { WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Web" }.Concat(parts).ToArray()));

    /// <summary>QA-09 · Başlangıç sütunu bitiş çipiyle aynı biçimde (yan yana iki biçim okunmuyordu).</summary>
    [Theory]
    [InlineData("Projects", "ProjectDetails.js")]
    [InlineData("Tasks", "index.js")]
    public void Baslangic_sutunu_bitis_cipiyle_ayni_bicimde(string folder, string file)
    {
        var js = Web("Pages", folder, file);
        js.ShouldNotContain("moment(data).format('L')");
        js.ShouldContain("moment(data).format('DD MMM YYYY')");
    }

    /// <summary>QA-10 · Sıralanan sütun düğmesi ekran okuyucuya da söylenir.</summary>
    [Fact]
    public void Siralanan_sutun_aria_pressed_tasir()
    {
        Web("Pages", "Projects", "Index.js").ShouldContain(".toggleClass('is-sorted', sorted).attr('aria-pressed', sorted ? 'true' : 'false')");
    }

    /// <summary>QA-11 · Proje türü radyolarının erişilebilir adı var.</summary>
    [Fact]
    public void Proje_turu_radyosu_adlandirilir()
    {
        Web("Pages", "Projects", "CreateModal.cshtml").ShouldContain("aria-label=\"@cat.Label — @cat.Description\"");
    }
}
