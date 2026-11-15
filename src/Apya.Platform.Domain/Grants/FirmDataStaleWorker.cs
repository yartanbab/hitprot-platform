using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Grants;

/// <summary>
/// Altı saatte bir <see cref="FirmDataStaleNotifier"/>. Süre gün düzeyinde dolar; saatlik taramaya
/// gerek yok, günde birkaç tur süresi dolan bilginin aynı gün haber verilmesine yeter.
/// </summary>
public class FirmDataStaleWorker : AsyncPeriodicBackgroundWorkerBase
{
    public FirmDataStaleWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 6 * 60 * 60 * 1000;
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var now = workerContext.ServiceProvider.GetRequiredService<IClock>().Now;
        var published = await workerContext.ServiceProvider.GetRequiredService<FirmDataStaleNotifier>().RunAsync(now);
        if (published > 0)
        {
            Logger.LogInformation("Güncelliğini yitiren kurum bilgisi: {Count} bildirim.", published);
        }
    }
}
