using System;
using Apya.Platform;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.AuditLogging;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.PostgreSql;
using Volo.Abp.EntityFrameworkCore.SqlServer;
using Volo.Abp.FeatureManagement;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace Apya.Platform.EntityFrameworkCore;

[DependsOn(
    typeof(PlatformDomainModule),
    typeof(AbpEntityFrameworkCorePostgreSqlModule),
    typeof(AbpEntityFrameworkCoreSqlServerModule),
    typeof(AbpIdentityEntityFrameworkCoreModule),
    typeof(AbpPermissionManagementEntityFrameworkCoreModule),
    typeof(AbpSettingManagementEntityFrameworkCoreModule),
    typeof(AbpFeatureManagementEntityFrameworkCoreModule),
    typeof(AbpTenantManagementEntityFrameworkCoreModule),
    typeof(AbpAuditLoggingEntityFrameworkCoreModule),
    typeof(AbpBackgroundJobsEntityFrameworkCoreModule),
    typeof(AbpOpenIddictEntityFrameworkCoreModule)
)]
public class PlatformEntityFrameworkCoreModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        // Npgsql 6+ default davranışı 'timestamp with time zone' için sadece UTC kabul eder.
        // ABP'nin eski entity'lerinde DateTime.Kind=Unspecified/Local olabilir → legacy mode aç.
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
    }

    // SQL Server migration'larının bulunduğu ayrı assembly.
    // Bkz. Apya.Platform.EntityFrameworkCore.SqlServer projesi.
    private const string SqlServerMigrationsAssembly = "Apya.Platform.EntityFrameworkCore.SqlServer";

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();
        var provider = DatabaseProviderResolver.Resolve(configuration);

        // Seçilen provider'ın bağlantı dizisini ABP'nin "Default" bağlantısı olarak ata.
        // İki bağlantı dizisi (ConnectionStrings:PostgreSql / :SqlServer) yan yana durur;
        // Database:Provider bayrağı hangisinin aktif olduğunu belirler.
        var connectionString = DatabaseProviderResolver.ResolveConnectionString(configuration, provider);
        if (!string.IsNullOrWhiteSpace(connectionString))
        {
            Configure<AbpDbConnectionOptions>(options =>
            {
                options.ConnectionStrings.Default = connectionString;
            });
        }

        // NOT: ABP modüllerinin DbContext'lerini PlatformDbContext'e yönlendirme
        // [ReplaceDbContext(typeof(...))] attribute'larıyla PlatformDbContext üzerinde yapılıyor.
        // options.ReplaceDbContext<T>() interface implementation gerektirir; attribute gerektirmez.
        context.Services.AddAbpDbContext<PlatformDbContext>(options =>
        {
            options.AddDefaultRepositories(includeAllEntities: true);
        });

        Configure<AbpDbContextOptions>(options =>
        {
            if (provider == DatabaseProvider.SqlServer)
            {
                options.UseSqlServer(b => b.MigrationsAssembly(SqlServerMigrationsAssembly));
            }
            else
            {
                options.UseNpgsql();
            }
        });
    }
}
