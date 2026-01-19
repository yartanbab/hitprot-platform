using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Apya.Platform.Data;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.EntityFrameworkCore;

public class EntityFrameworkCorePlatformDbSchemaMigrator
    : IPlatformDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCorePlatformDbSchemaMigrator(
        IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolve the PlatformDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<PlatformDbContext>()
            .Database
            .MigrateAsync();
    }
}
