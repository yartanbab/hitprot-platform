using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Apya.Platform.Ai;

[DependsOn(
    typeof(PlatformAiDomainModule),
    typeof(AbpEntityFrameworkCoreModule)
)]
public class PlatformAiEntityFrameworkCoreModule : AbpModule
{
    // 109.3'te AI entity'leri için repository registration burada eklenecek.
    // ConfigureAi() extension method'u host DbContext'in OnModelCreating'inde çağrılır.
}
