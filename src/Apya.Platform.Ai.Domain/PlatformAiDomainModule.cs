using Volo.Abp.BackgroundJobs;
using Volo.Abp.DistributedLocking;
using Volo.Abp.Domain;
using Volo.Abp.EventBus;
using Volo.Abp.Modularity;

namespace Apya.Platform.Ai;

[DependsOn(
    typeof(PlatformAiDomainSharedModule),
    typeof(PlatformDomainModule),
    typeof(AbpDddDomainModule),
    typeof(AbpBackgroundJobsDomainModule),
    typeof(AbpDistributedLockingAbstractionsModule),
    typeof(AbpEventBusModule)
)]
public class PlatformAiDomainModule : AbpModule
{
}
