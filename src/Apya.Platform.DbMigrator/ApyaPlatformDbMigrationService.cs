using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.DbMigrator;

public class ApyaPlatformDbMigrationService : ITransientDependency
{
    public ILogger<ApyaPlatformDbMigrationService> Logger { get; set; }

    private readonly IDataSeeder _dataSeeder;

    public ApyaPlatformDbMigrationService(IDataSeeder dataSeeder)
    {
        _dataSeeder = dataSeeder;
        Logger = NullLogger<ApyaPlatformDbMigrationService>.Instance;
    }

    public async Task MigrateAsync()
    {
        Logger.LogInformation("Started database migrations...");

        Logger.LogInformation("Migrating database schema...");
        // EF Core otomatik migration yapar (Auto-migration modül içindeyse)

        Logger.LogInformation("Executing data seeders...");
        await _dataSeeder.SeedAsync();

        Logger.LogInformation("Successfully completed all database migrations.");
    }
}