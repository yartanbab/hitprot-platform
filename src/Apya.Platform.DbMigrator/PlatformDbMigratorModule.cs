using Apya.Platform.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Apya.Platform.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(PlatformEntityFrameworkCoreModule),
    typeof(PlatformApplicationContractsModule)
    )]
public class PlatformDbMigratorModule : AbpModule
{
}
