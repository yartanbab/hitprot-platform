using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Invoices;

/// <summary>B-16 · Saatte bir <see cref="InvoiceOverdueNotifier"/>; kullanıcı fatura + vade başına bir bildirim alır.</summary>
public class InvoiceOverdueWorker : AsyncPeriodicBackgroundWorkerBase
{
    public InvoiceOverdueWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000;
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var now = workerContext.ServiceProvider.GetRequiredService<IClock>().Now;
        var published = await workerContext.ServiceProvider.GetRequiredService<InvoiceOverdueNotifier>().RunAsync(now);
        if (published > 0)
        {
            Logger.LogInformation("Geciken fatura: {Count} bildirim.", published);
        }
    }
}
