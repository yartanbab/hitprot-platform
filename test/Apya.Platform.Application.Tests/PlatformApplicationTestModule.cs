using Volo.Abp.Modularity;

namespace Apya.Platform;

[DependsOn(
    typeof(PlatformApplicationModule),
    typeof(PlatformDomainTestModule)
)]
public class PlatformApplicationTestModule : AbpModule
{

}
