using Volo.Abp.Application;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;

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
    }
}
