using System.IO;
using Apya.Platform.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Apya.Platform.EntityFrameworkCore.SqlServer;

/// <summary>
/// SADECE design-time (dotnet ef) için: bu assembly SQL Server migration'larını barındırır,
/// ama içinde PlatformDbContext tipi yok. EF, referanslı assembly'leri taramadığı için
/// EFCore projesindeki factory'yi bulamaz; bu yüzden hedef assembly'de (burada) bir factory
/// bulunmalı. Runtime'da kullanılmaz — çalışırken sağlayıcı seçimi modül üzerinden yapılır.
/// </summary>
public class SqlServerPlatformDbContextFactory : IDesignTimeDbContextFactory<PlatformDbContext>
{
    public PlatformDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            BuildConfiguration()?.GetConnectionString("SqlServer")
            ?? "Server=localhost;Database=ApyaPlatform;Trusted_Connection=True;TrustServerCertificate=True";

        var builder = new DbContextOptionsBuilder<PlatformDbContext>()
            .UseSqlServer(
                connectionString,
                b => b.MigrationsAssembly("Apya.Platform.EntityFrameworkCore.SqlServer"));

        return new PlatformDbContext(builder.Options);
    }

    // DbMigrator/appsettings.json'ı çalışma dizinine göre bulmaya çalışır; bulamazsa null döner
    // (migration üretiminde bağlantı gerekmediği için placeholder connection string yeterli).
    private static IConfigurationRoot? BuildConfiguration()
    {
        var candidatePaths = new[]
        {
            Path.Combine(Directory.GetCurrentDirectory(), "../Apya.Platform.DbMigrator/"),
            Path.Combine(Directory.GetCurrentDirectory(), "../../Apya.Platform.DbMigrator/"),
            Path.Combine(Directory.GetCurrentDirectory(), "src/Apya.Platform.DbMigrator/")
        };

        foreach (var basePath in candidatePaths)
        {
            if (File.Exists(Path.Combine(basePath, "appsettings.json")))
            {
                return new ConfigurationBuilder()
                    .SetBasePath(basePath)
                    .AddJsonFile("appsettings.json", optional: false)
                    .Build();
            }
        }

        return null;
    }
}
