using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Apya.Platform.EntityFrameworkCore;

public class PlatformDbContextFactory : IDesignTimeDbContextFactory<PlatformDbContext>
{
    public PlatformDbContext CreateDbContext(string[] args)
    {
        // Connection string'i DbMigrator veya HttpApi içindeki appsettings.json'dan okur
        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<PlatformDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));

        return new PlatformDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Apya.Platform.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}