using System;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Shouldly;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// H-16 · Kiracının çağrı ekranı ("Fırsatlar"): menüdeki adıyla açılır, metinleri yerelleştirmeden
/// gelir, "Başvurularım" kartları tıklanır; başvuru sihirbazının "Firma profilini düzenle" bağlantısı
/// profil düzenleyicisini açık getirir.
/// </summary>
public class GrantOpportunitiesPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Kiraci_ekrani_menudeki_adiyla_acilir_ve_basvurulari_baglar()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("firsat-" + Guid.NewGuid().ToString("N")[..8]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        await WithTenantClientAsync(tenant.Id, async client =>
        {
            var html = WebUtility.HtmlDecode(await client.GetStringAsync("/Grants"));

            Regex.IsMatch(html, @"<title>\s*Fırsatlar").ShouldBeTrue("sekme başlığı menüdeki adla aynı olmalı");
            html.ShouldContain("data-page-description=\"Profilinize uygun açık hibe çağrıları ve başvurularınız\"");
            html.ShouldContain("danışmanınız da sizin adınıza işaretleyebilir");
            // Başvurularım bloğu kalır (kilometre taşları firmaya yalnız burada görünür), başlığı ekrana bağlanır.
            html.ShouldContain("id=\"AppsList\"");
            html.ShouldContain("href=\"/Grants/MyApplications\"");
        });
    }

    [Fact]
    public void Basvuru_kartlari_ve_profil_baglantisi_bir_yere_gider()
    {
        var pages = Path.Combine(WebSourceFiles.RepoRoot(), "src", "Apya.Platform.Web", "Pages", "Grants");
        var tenantJs = File.ReadAllText(Path.Combine(pages, "Tenant.js"));

        tenantJs.ShouldContain("href=\"/Grants/Wizard?id=' + a.id");
        tenantJs.ShouldNotContain("'Tamamlandı'");
        tenantJs.ShouldContain("location.hash === '#profil'");
        File.ReadAllText(Path.Combine(pages, "Wizard.cshtml")).ShouldContain("href=\"/Grants#profil\"");
    }
}
