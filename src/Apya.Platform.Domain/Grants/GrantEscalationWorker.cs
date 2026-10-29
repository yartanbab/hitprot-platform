using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Grants;

/// <summary>
/// Faz 2 · Kademeli yükseltmeyi saatte bir koşturur (<see cref="GrantEscalationManager"/>). Saatlik: eşikler
/// gün cinsinden ama "en az N gün" diye okunur, geciken tur kaçan kademeyi yetiştirir.
/// </summary>
public class GrantEscalationWorker : AsyncPeriodicBackgroundWorkerBase
{
    public GrantEscalationWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // 60 dakika
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var sp = workerContext.ServiceProvider;
        var sent = await sp.GetRequiredService<GrantEscalationManager>()
            .RunAsync(sp.GetRequiredService<IClock>().Now);

        if (sent > 0)
        {
            Logger.LogInformation("Hibe yükseltme taraması: {Count} yükseltme gönderildi", sent);
        }
    }
}
