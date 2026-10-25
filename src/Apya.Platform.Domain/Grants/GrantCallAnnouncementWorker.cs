using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Grants;

/// <summary>
/// Açık ama duyurulmamış çağrıları saatte bir tarar. Kural ve işaretleme
/// <see cref="GrantCallAnnouncer.AnnounceUnannouncedAsync"/>'te; buraya yalnız zamanlama ait.
/// Günlük değil saatlik: veritabanına dışarıdan eklenen hibe firmaya ertesi günü beklemeden ulaşsın.
/// </summary>
public class GrantCallAnnouncementWorker : AsyncPeriodicBackgroundWorkerBase
{
    public GrantCallAnnouncementWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // 60 dakika
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var sp = workerContext.ServiceProvider;
        var announced = await sp.GetRequiredService<GrantCallAnnouncer>()
            .AnnounceUnannouncedAsync(sp.GetRequiredService<IClock>().Now);

        if (announced > 0)
        {
            Logger.LogInformation("Duyurulmamış çağrı taraması: {Count} çağrı duyuruldu", announced);
        }
    }
}
