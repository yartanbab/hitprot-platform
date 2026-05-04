using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Modularity;

namespace Apya.Platform.Ai;

[DependsOn(
    typeof(PlatformAiApplicationContractsModule),
    typeof(PlatformHttpApiModule),
    typeof(AbpAspNetCoreMvcModule)
)]
public class PlatformAiHttpApiModule : AbpModule
{
}
