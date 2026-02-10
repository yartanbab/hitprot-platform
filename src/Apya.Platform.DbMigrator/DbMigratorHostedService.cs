using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Apya.Platform.Data;
using Volo.Abp;
using Volo.Abp.Data;
using Serilog;

namespace Apya.Platform.DbMigrator;

public class DbMigratorHostedService : IHostedService
{
    private readonly IHostApplicationLifetime _hostApplicationLifetime;
    private readonly IConfiguration _configuration;

    public DbMigratorHostedService(IHostApplicationLifetime hostApplicationLifetime, IConfiguration configuration)
    {
        _hostApplicationLifetime = hostApplicationLifetime;
        _configuration = configuration;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // DİKKAT: Aşağıdaki 'PlatformDbMigratorModule' ismi 1. dosya ile aynı olmalı
        using (var application = await AbpApplicationFactory.CreateAsync<PlatformDbMigratorModule>(options =>
        {
            options.Services.ReplaceConfiguration(_configuration);
            options.UseAutofac();
            options.Services.AddLogging(c => c.AddSerilog());
        }))
        {
            await application.InitializeAsync();

            using (var scope = application.ServiceProvider.CreateScope())
            {
                await application.ServiceProvider
                    .GetRequiredService<ApyaPlatformDbMigrationService>()
                    .MigrateAsync();
            }

            await application.ShutdownAsync();

            _hostApplicationLifetime.StopApplication();
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}