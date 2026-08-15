using System.Collections.Generic;
using System.Globalization;
using Localization.Resources.AbpUi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Apya.Platform.EntityFrameworkCore;
using Apya.Platform.Localization;
using Apya.Platform.Web;
using Apya.Platform.Web.Menus;
using Volo.Abp;
using Volo.Abp.AspNetCore.TestBase;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict;
using Volo.Abp.UI.Navigation;
using Volo.Abp.Validation.Localization;

namespace Apya.Platform;

[DependsOn(
    typeof(AbpAspNetCoreTestBaseModule),
    typeof(PlatformWebModule),
    typeof(PlatformApplicationTestModule),
    typeof(PlatformEntityFrameworkCoreTestModule)
)]
public class PlatformWebTestModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        // TEST-002: SEC-001 commit'li ClientSecret'i appsettings'ten boşalttı; OpenIddict data
        // seeder Confidential Platform_Web istemcisi için boş secret'ı reddedip test host'unu
        // çökertiyor. Testlerde gerçek OAuth yok → seed'in geçmesi için test-only dummy secret ver
        // (prod sırrı değil). In-memory kaynak en sona eklenir → appsettings'teki boş değeri ezer.
        var testConfiguration = new ConfigurationBuilder()
            .AddConfiguration(context.Services.GetConfiguration())
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["OpenIddict:Applications:Platform_Web:ClientSecret"] = "test-only-not-a-real-secret"
            })
            .Build();
        context.Services.ReplaceConfiguration(testConfiguration);

        context.Services.PreConfigure<IMvcBuilder>(builder =>
        {
            builder.PartManager.ApplicationParts.Add(new CompiledRazorAssemblyPart(typeof(PlatformWebModule).Assembly));
        });

        context.Services.GetPreConfigureActions<OpenIddictServerBuilder>().Clear();
        PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
        {
            options.AddDevelopmentEncryptionAndSigningCertificate = true;
        });
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        ConfigureLocalizationServices(context.Services);
        ConfigureNavigationServices(context.Services);
    }

    private static void ConfigureLocalizationServices(IServiceCollection services)
    {
        var cultures = new List<CultureInfo> { new CultureInfo("en"), new CultureInfo("tr") };
        services.Configure<RequestLocalizationOptions>(options =>
        {
            options.DefaultRequestCulture = new RequestCulture("en");
            options.SupportedCultures = cultures;
            options.SupportedUICultures = cultures;
        });

        services.Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<PlatformResource>()
                .AddBaseTypes(
                    typeof(AbpValidationResource),
                    typeof(AbpUiResource)
                );
        });
    }

    private static void ConfigureNavigationServices(IServiceCollection services)
    {
        services.Configure<AbpNavigationOptions>(options =>
        {
            options.MenuContributors.Add(new PlatformMenuContributor());
        });
    }
}
