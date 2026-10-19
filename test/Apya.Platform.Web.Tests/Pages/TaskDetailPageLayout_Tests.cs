using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// QA-31 · Görev detayı sayfası telefonda yatay taşmaz. .lpx-content sütun yönlü flex; sarmalayıcıdaki
/// mx-auto uzamayı kapatıp genişliği içeriğin en küçük genişliğine oturtuyordu (375px'te 669px).
/// </summary>
public class TaskDetailPageLayout_Tests
{
    [Fact]
    public void Sarmalayici_ekran_genisligine_uyar()
    {
        var cshtml = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Pages", "Tasks", "Detail.cshtml"));

        cshtml.ShouldContain("class=\"apya-page max-w-7xl mx-auto w-full min-w-0 py-4 px-4\"");
    }
}
