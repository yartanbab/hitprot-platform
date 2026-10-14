using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages.Macros;
using Shouldly;
using Xunit;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran panelleri hangi kaynağı çeker? Karar sunucuda (IndexModel.ResolvePanels) ve kaynağın
/// kendi kapısıyla aynı olmalı: aksi hâlde istemci yasak bir uca istek atar (403) ya da yetkisiz
/// kullanıcıya "0" basar.
/// </summary>
public class MacroPanelSources_Tests
{
    private static HashSet<string> Granted(params string[] permissions) => new(permissions);

    [Fact]
    public void Kiraci_hibe_gorme_izniyle_talep_basvuru_ve_Bugun_kaynaklarini_alir()
    {
        var (groups, sources) = IndexModel.ResolvePanels(isHost: false, Granted(PlatformPermissions.Grants.Default));

        groups.ShouldBe(new[] { "interests", "applications" });
        sources.ShouldBe(new[] { "grantToday" });
    }

    /// <summary>Host'un hibe kutuları (talepler, başvuru hattı, Bugün) Grants.Edit ister.</summary>
    [Fact]
    public void Host_hibe_kaynaklari_icin_duzenleme_izni_ister()
    {
        var (groups, sources) = IndexModel.ResolvePanels(isHost: true, Granted(PlatformPermissions.Grants.Default));
        groups.ShouldBeEmpty();
        sources.ShouldBeEmpty();

        (groups, sources) = IndexModel.ResolvePanels(isHost: true,
            Granted(PlatformPermissions.Grants.Default, PlatformPermissions.Grants.Edit));
        groups.ShouldBeEmpty(); // firmanın talepleri/başvuruları host'ta "bana ait" değil
        sources.ShouldBe(new[] { "grantInterests", "grantApplications", "grantToday" });
    }

    /// <summary>Taslak fatura sayısı Genel Bakış servisinden gelir; o servis Projects.Default ister.</summary>
    [Fact]
    public void Taslak_fatura_sayaci_proje_ve_fatura_iznini_birlikte_ister()
    {
        IndexModel.ResolvePanels(isHost: true, Granted(PlatformPermissions.Invoices.Default))
            .Sources.ShouldNotContain("draftInvoices");

        var (groups, sources) = IndexModel.ResolvePanels(isHost: true,
            Granted(PlatformPermissions.Invoices.Default, PlatformPermissions.Projects.Default));
        groups.ShouldBe(new[] { "projects" });
        sources.ShouldBe(new[] { "draftInvoices" });
    }

    [Fact]
    public void Geciken_gorev_sayaci_gorev_gorme_izniyle_gelir()
    {
        IndexModel.ResolvePanels(isHost: false, Granted(PlatformPermissions.Tasks.Default))
            .Sources.ShouldBe(new[] { "overdueTasks" });
        IndexModel.ResolvePanels(isHost: false, Granted()).Sources.ShouldBeEmpty();
    }
}

/// <summary>Panellerin gerçek render'ı (host bağlamı, test barındırıcısı her izni verir).</summary>
public class MacroPanelsPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Host_sayfasi_panelleri_host_kaynaklariyla_basar()
    {
        var html = await GetResponseAsStringAsync("/Makro");

        html.ShouldContain("id=\"MacrosNotifications\"");
        html.ShouldContain("data-groups=\"projects\"");
        html.ShouldContain("data-sources=\"overdueTasks,grantInterests,grantApplications,grantToday,draftInvoices\"");
        html.ShouldContain("has-records");
        // Host'ta firma talepleri grubu yok → hibe durum kataloğu da basılmaz.
        html.ShouldNotContain("window.apyaGrantStatus");
        Regex.IsMatch(html, @"Macros[^""]*\.js").ShouldBeTrue();
    }
}
