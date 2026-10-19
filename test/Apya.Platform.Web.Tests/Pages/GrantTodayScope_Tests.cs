using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// H-05 · Danışmanın Bugün'ü varsayılan olarak "Bana atananlar" (+ atanmamışlar) açılır; talep satırı
/// kaydın kendisine gider; dilim işi Uygulama ekranına götürür (betik pinleri).
/// </summary>
public class GrantTodayScope_Tests
{
    private static string Js() => File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
        "src", "Apya.Platform.Web", "Pages", "Grants", "Today.js"));

    [Fact]
    public void Varsayilan_bana_atananlar_atanmamislar_dahil()
    {
        var js = Js();
        js.ShouldContain("var scope = 'mine';");
        js.ShouldContain("scope === 'team' || !i.assignedUserId || i.assignedUserId === me");
    }

    [Fact]
    public void Talep_satiri_kaydin_kendisine_dilim_uygulamaya_gider()
    {
        var js = Js();
        js.ShouldContain("case 6: return '/Grants/Leads' + (item.leadId ? '?id=' + item.leadId : '');");
        js.ShouldContain("case 3: case 10: return '/Grants/Implementation?id=' + item.applicationId;");
    }
}
