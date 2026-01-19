using Volo.Abp.Modularity;

namespace Apya.Platform;

public abstract class PlatformApplicationTestBase<TStartupModule> : PlatformTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
