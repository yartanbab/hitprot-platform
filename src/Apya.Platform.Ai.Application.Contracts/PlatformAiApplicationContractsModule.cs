using Volo.Abp.Application;
using Volo.Abp.Authorization;
using Volo.Abp.Modularity;
using Volo.Abp.ObjectExtending;

namespace Apya.Platform.Ai;

[DependsOn(
    typeof(PlatformAiDomainSharedModule),
    typeof(PlatformApplicationContractsModule),
    typeof(AbpDddApplicationContractsModule),
    typeof(AbpAuthorizationModule),
    typeof(AbpObjectExtendingModule)
)]
public class PlatformAiApplicationContractsModule : AbpModule
{
}
