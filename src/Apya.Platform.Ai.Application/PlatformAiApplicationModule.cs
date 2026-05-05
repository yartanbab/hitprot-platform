using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Application;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;
using Apya.Platform.Ai.Providers;

namespace Apya.Platform.Ai;

[DependsOn(
    typeof(PlatformAiDomainModule),
    typeof(PlatformAiApplicationContractsModule),
    typeof(PlatformApplicationModule),
    typeof(AbpDddApplicationModule),
    typeof(AbpAutoMapperModule)
)]
public class PlatformAiApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<PlatformAiApplicationModule>();
        });

        // AiGateway (ITransientDependency) auto-registers as IAiProvider.
        // OpenAiProvider is the inner concrete dependency — register explicitly.
        context.Services.AddTransient<OpenAiProvider>();
    }
}
