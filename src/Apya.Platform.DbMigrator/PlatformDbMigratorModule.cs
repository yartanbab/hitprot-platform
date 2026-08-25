using Apya.Platform.EntityFrameworkCore;
using Apya.Platform;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Apya.Platform.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(PlatformEntityFrameworkCoreModule), // İsim düzeltildi
    // Application modülü Contracts'ı zaten kapsıyor; ikisi de listede kalıyor ki
    // bağımlılık niyeti açık olsun (ABP mükerrer modülü tekilleştirir).
    typeof(PlatformApplicationContractsModule), // İsim düzeltildi
    // Tohumlayıcılar Application katmanında; modül YÜKLENMEDEN
    // IDataSeedContributor'ları DI'ya kaydolmuyor ve hiç çalışmıyorlardı.
    // Gerekçe ve ölçüm csproj'daki yorumda.
    typeof(PlatformApplicationModule),
    typeof(Apya.Platform.Ai.PlatformAiEntityFrameworkCoreModule),
    typeof(Apya.Platform.Ai.PlatformAiApplicationContractsModule),
    typeof(Apya.Platform.Ai.PlatformAiApplicationModule)
    )]
public class PlatformDbMigratorModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Konfigürasyon
    }
}