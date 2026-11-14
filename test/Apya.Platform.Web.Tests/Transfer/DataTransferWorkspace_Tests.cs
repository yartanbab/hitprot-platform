using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.Transfer;

/// <summary>
/// İçe / Dışa Aktarma çalışma alanı: host kendi modüllerini, kiracı kendi modüllerini görür; "tek
/// anahtar" kapalıyken herkes aktarır.
/// </summary>
public class DataTransferWorkspace_Tests : PlatformWebTestBase
{
    private static string[] Modules(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc.DocumentNode.SelectNodes("//tr[@data-transfer-module]")?
            .Select(n => n.GetAttributeValue("data-transfer-module", "")).ToArray() ?? [];
    }

    private async Task<Guid> SeedTenantAsync()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("aktarim-" + Guid.NewGuid().ToString("N")[..8]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    [Fact]
    public async Task Host_kendi_modullerini_gorur_kiraciya_ozel_olanlari_gormez()
    {
        var export = Modules(await GetResponseAsStringAsync("/DataTransfer"));
        export.ShouldContain("tasks");
        export.ShouldContain("expenses");
        export.ShouldContain("tenants");
        export.ShouldContain("grant-calls");
        export.ShouldNotContain("grant-feed");
        export.ShouldNotContain("my-grant-applications");

        // İçe aktar sekmesi yalnız içe aktarması olan modülleri listeler.
        var import = Modules(await GetResponseAsStringAsync("/DataTransfer?tab=import"));
        import.ShouldContain("expenses");
        import.ShouldContain("exchange-rates");
        import.ShouldNotContain("tenants");
        import.ShouldNotContain("documents");
    }

    [Fact]
    public async Task Kiraci_host_modullerini_gormez()
    {
        await WithTenantClientAsync(await SeedTenantAsync(), async client =>
        {
            var response = await client.GetAsync("/DataTransfer");
            response.StatusCode.ShouldBe(HttpStatusCode.OK);
            var modules = Modules(await response.Content.ReadAsStringAsync());

            modules.ShouldContain("tasks");
            modules.ShouldContain("my-grant-applications");
            modules.ShouldNotContain("tenants");
            modules.ShouldNotContain("registration-requests");
            modules.ShouldNotContain("grant-calls");
        });
    }

    [Fact]
    public async Task Anahtar_kapaliyken_erisim_karti_yalniz_hostta_gorunur_ve_dogrudan_indirme_calisir()
    {
        var html = await GetResponseAsStringAsync("/DataTransfer");
        html.ShouldContain("data-transfer-access");

        await WithTenantClientAsync(await SeedTenantAsync(), async client =>
        {
            (await client.GetStringAsync("/DataTransfer")).ShouldNotContain("data-transfer-access");
        });

        var csv = await GetResponseAsync("/ExchangeRates?handler=Excel&format=csv");
        csv.Content.Headers.ContentType!.MediaType.ShouldBe("text/csv");
    }
}

/// <summary>
/// "Tek anahtar" AÇIKKEN: dışa aktarma izni olmayan kişi hiçbir dışa aktarma ucunu çağıramaz;
/// içe aktarma izni duruyorsa içe aktarma çalışmaya devam eder. Anahtar kapalıyken aynı kişi
/// dışa aktarır. Barındırıcı yalnız dışa aktarma iznini reddedecek şekilde kurulur.
/// </summary>
public class DataTransferEnforcement_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.DataTransfer.Export);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    private Task SetEnforcedAsync(bool on)
        => GetRequiredService<ISettingManager>().SetGlobalAsync(PlatformSettings.DataTransfer.EnforcePermissions, on ? "true" : "false");

    [Fact]
    public async Task Anahtar_acikken_izni_olmayan_disa_aktaramaz_kapaninca_aktarir()
    {
        await SetEnforcedAsync(false);
        await GetResponseAsync("/Expenses?handler=Excel");

        await SetEnforcedAsync(true);
        try
        {
            // Excel, CSV, JSON ve kendi düzenini yazan raporlar: hepsi katalogdan aynı kurala girer.
            (await Client.GetAsync("/Expenses?handler=Excel")).StatusCode.ShouldNotBe(HttpStatusCode.OK);
            (await Client.GetAsync("/Expenses?handler=Excel&format=csv")).StatusCode.ShouldNotBe(HttpStatusCode.OK);
            (await Client.GetAsync("/TenantManagement/Tenants?handler=Excel")).StatusCode.ShouldNotBe(HttpStatusCode.OK);
            (await Client.GetAsync("/Grants/NotificationTemplates?handler=Export")).StatusCode.ShouldNotBe(HttpStatusCode.OK);

            // İçe aktarma izni reddedilmedi: şablon iner.
            await GetResponseAsync("/Expenses/ImportModal?handler=Template");

            // Çalışma alanı açılır ama dışa aktar sekmesi boştur.
            var html = await GetResponseAsStringAsync("/DataTransfer");
            html.ShouldNotContain("data-transfer-export");
            (await GetResponseAsStringAsync("/DataTransfer?tab=import")).ShouldContain("data-transfer-import");

            // Sayfanın kendisi aktarım ucu değildir: liste ekranı açılmaya devam eder.
            await GetResponseAsync("/Expenses");
        }
        finally
        {
            await SetEnforcedAsync(false);
        }
    }
}
