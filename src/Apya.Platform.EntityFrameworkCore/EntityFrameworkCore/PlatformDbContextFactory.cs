using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Apya.Platform.EntityFrameworkCore;

public class PlatformDbContextFactory : IDesignTimeDbContextFactory<PlatformDbContext>
{
    private const string SqlServerMigrationsAssembly = "Apya.Platform.EntityFrameworkCore.SqlServer";

    public PlatformDbContext CreateDbContext(string[] args)
    {
        // Connection string'i DbMigrator içindeki appsettings.json'dan okur.
        // Database:Provider bayrağı hangi sağlayıcının migration'larını üreteceğimizi belirler.
        var configuration = BuildConfiguration();
        var provider = DatabaseProviderResolver.Resolve(configuration);
        var connectionString = DatabaseProviderResolver.ResolveConnectionString(configuration, provider);

        var builder = new DbContextOptionsBuilder<PlatformDbContext>();

        if (provider == DatabaseProvider.SqlServer)
        {
            builder.UseSqlServer(connectionString, b => b.MigrationsAssembly(SqlServerMigrationsAssembly));
        }
        else
        {
            builder.UseNpgsql(connectionString);
        }

        return new PlatformDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        // Ortam değişkeni override'ı: appsettings'i değiştirmeden SqlServer migration'ı üretmek için
        //   $env:Database__Provider='SqlServer'; dotnet ef migrations add ... -p ...SqlServer -s ...Web
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Apya.Platform.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddEnvironmentVariables();

        return builder.Build();
    }
}
