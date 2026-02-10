using Apya.Platform.EntityFrameworkCore;
using Apya.Platform;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Apya.Platform.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(PlatformEntityFrameworkCoreModule), // İsim düzeltildi
    typeof(PlatformApplicationContractsModule) // İsim düzeltildi
    )]
public class PlatformDbMigratorModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Konfigürasyon
    }
}