using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Apya.Platform.EntityFrameworkCore;

namespace Apya.Platform.DbMigrator;

public class ApyaPlatformDbMigrationService : ITransientDependency
{
    public ILogger<ApyaPlatformDbMigrationService> Logger { get; set; }

    private readonly IDataSeeder _dataSeeder;
    private readonly IServiceProvider _serviceProvider;

    public ApyaPlatformDbMigrationService(
        IDataSeeder dataSeeder,
        IServiceProvider serviceProvider)
    {
        _dataSeeder = dataSeeder;
        _serviceProvider = serviceProvider;
        Logger = NullLogger<ApyaPlatformDbMigrationService>.Instance;
    }

    public async Task MigrateAsync()
    {
        Logger.LogInformation("Started database migrations...");

        Logger.LogInformation("Migrating database schema...");
        using (var scope = _serviceProvider.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<PlatformDbContext>();
            await dbContext.Database.MigrateAsync();
        }

        Logger.LogInformation("Executing data seeders...");
        await _dataSeeder.SeedAsync();

        Logger.LogInformation("Successfully completed all database migrations.");
    }
}