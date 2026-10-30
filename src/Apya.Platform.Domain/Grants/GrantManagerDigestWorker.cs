using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Grants;

/// <summary>
/// Faz 3 · Yönetici özetinin zamanlayıcısı. Saatte bir uyanır; vaktin gelip gelmediğine
/// <see cref="GrantManagerDigestSender"/> karar verir (son gönderim günü kalıcı).
/// </summary>
public class GrantManagerDigestWorker : AsyncPeriodicBackgroundWorkerBase
{
    public GrantManagerDigestWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // 60 dakika
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var sp = workerContext.ServiceProvider;
        var sent = await sp.GetRequiredService<GrantManagerDigestSender>()
            .RunAsync(DateTime.UtcNow, sp.GetRequiredService<IClock>().Now);

        if (sent > 0)
        {
            Logger.LogInformation("Hibe yönetici özeti: {Count} özet gönderildi", sent);
        }
    }
}
