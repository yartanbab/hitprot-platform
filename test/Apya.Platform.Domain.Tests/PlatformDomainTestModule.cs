using Volo.Abp.Modularity;

namespace Apya.Platform;

[DependsOn(
    typeof(PlatformDomainModule),
    typeof(PlatformTestBaseModule)
)]
public class PlatformDomainTestModule : AbpModule
{

}
