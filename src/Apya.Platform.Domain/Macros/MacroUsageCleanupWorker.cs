using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro kullanım sayacının 30 günlük pencere dışındaki satırlarını günde bir siler.
/// Kural <see cref="MacroUsageManager.DeleteOutsideWindowAsync"/>'ta; işçi yalnız zamanlar.
/// </summary>
public class MacroUsageCleanupWorker : AsyncPeriodicBackgroundWorkerBase
{
    public MacroUsageCleanupWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 24 * 60 * 60 * 1000; // 24 saat
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var manager = workerContext.ServiceProvider.GetRequiredService<MacroUsageManager>();
        var clock = workerContext.ServiceProvider.GetRequiredService<IClock>();

        var deleted = await manager.DeleteOutsideWindowAsync(clock.Now);
        if (deleted > 0)
        {
            Logger.LogInformation("MacroUsageCleanupWorker: {Count} eski kullanım satırı silindi.", deleted);
        }
    }
}
