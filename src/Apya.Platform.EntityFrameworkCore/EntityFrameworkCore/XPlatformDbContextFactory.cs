//using System;
//using System.IO;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Design;
//using Microsoft.Extensions.Configuration;

//namespace Apya.Platform.EntityFrameworkCore;

///* This class is needed for EF Core console commands
// * (like Add-Migration and Update-Database commands) */
//public class PlatformDbContextFactory : IDesignTimeDbContextFactory<PlatformDbContext>
//{
//    public PlatformDbContext CreateDbContext(string[] args)
//    {
//        PlatformEfCoreEntityExtensionMappings.Configure();

//        var configuration = BuildConfiguration();

//        var builder = new DbContextOptionsBuilder<PlatformDbContext>()
//            .UseSqlServer(configuration.GetConnectionString("Default"));

//        return new PlatformDbContext(builder.Options);
//    }

//    private static IConfigurationRoot BuildConfiguration()
//    {
//        var builder = new ConfigurationBuilder()
//            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Apya.Platform.DbMigrator/"))
//            .AddJsonFile("appsettings.json", optional: false);

//        return builder.Build();
//    }
//}
