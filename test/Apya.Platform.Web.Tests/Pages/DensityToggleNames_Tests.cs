using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>QA-45 · Yoğunluk düğmelerinin erişilebilir adı tek harf değil.</summary>
public class DensityToggleNames_Tests
{
    [Theory]
    [InlineData("Tasks", "Index.cshtml")]
    [InlineData("Projects", "ProjectDetails.cshtml")]
    public void Yogunluk_dugmelerinin_adi_var(string folder, string file)
    {
        var page = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Pages", folder, file));

        page.ShouldContain("aria-label=\"Sıkı yoğunluk\"");
        page.ShouldContain("aria-label=\"Normal yoğunluk\"");
        page.ShouldContain("aria-label=\"Geniş yoğunluk\"");
    }
}
