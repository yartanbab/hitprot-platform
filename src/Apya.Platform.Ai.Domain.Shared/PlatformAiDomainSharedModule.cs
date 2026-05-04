using Volo.Abp.Modularity;
using Volo.Abp.Validation;

namespace Apya.Platform.Ai;

[DependsOn(
    typeof(PlatformDomainSharedModule),
    typeof(AbpValidationModule)
)]
public class PlatformAiDomainSharedModule : AbpModule
{
}
