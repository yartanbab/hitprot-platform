using System.Threading.Tasks;

namespace Apya.Platform.Data;

public interface IPlatformDbSchemaMigrator
{
    Task MigrateAsync();
}
