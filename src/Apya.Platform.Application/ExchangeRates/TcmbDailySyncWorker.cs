using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.ExchangeRates;

/// <summary>
/// F-06b · Saatte bir, yalnız iş günü 09:00–19:59 arasında <see cref="TcmbDailySync"/>'i çalıştırır. TCMB bülteni
/// 15:30 civarı yayımlanır; öncesindeki çalıştırmalar önceki iş gününün bültenini görür (eksikse ekler, varsa
/// dokunmaz). Hafta sonu istek atılmaz; pazartesi sabahı Cuma bülteni eksikse tamamlanır.
/// </summary>
public class TcmbDailySyncWorker : AsyncPeriodicBackgroundWorkerBase
{
    public TcmbDailySyncWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000;
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var now = workerContext.ServiceProvider.GetRequiredService<IClock>().Now;
        if (now.DayOfWeek is System.DayOfWeek.Saturday or System.DayOfWeek.Sunday || now.Hour < 9 || now.Hour >= 20)
        {
            return;
        }

        var added = await workerContext.ServiceProvider.GetRequiredService<TcmbDailySync>().RunAsync();
        if (added > 0)
        {
            Logger.LogInformation("TCMB günlük kur: {Count} kayıt eklendi.", added);
        }
    }
}
