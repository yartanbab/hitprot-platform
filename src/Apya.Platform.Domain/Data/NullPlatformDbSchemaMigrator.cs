using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Data;

/* This is used if database provider does't define
 * IPlatformDbSchemaMigrator implementation.
 */
public class NullPlatformDbSchemaMigrator : IPlatformDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
