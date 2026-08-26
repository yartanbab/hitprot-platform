using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Tenants;

/// <summary>
/// Paket sürelerini yoklayan zamanlayıcı. Kasten İNCE: tüm mantık
/// <see cref="SubscriptionExpiryProcessor"/>'dadır (Application katmanı) ki testler bir turu
/// worker'ı ayağa kaldırmadan çalıştırabilsin. Kaydı <c>PlatformWebModule</c>'dedir —
/// ScheduledReportWorker ile aynı desen.
/// </summary>
public class SubscriptionExpiryWorker : AsyncPeriodicBackgroundWorkerBase
{
    public SubscriptionExpiryWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        // Saatte bir. "Günde bir" olsaydı gece yarısı dolan bir abonelik ertesi günün
        // turuna kadar açık kalır, kiracı ödemediği paketi bir gün daha kullanırdı.
        // Tarama iki indeksli tek sorgu; saatlik yükü yok sayılır.
        Timer.Period = 60 * 60 * 1000;

        // İlk tur AÇILIŞTA atılır. Varsayılan davranışta ilk tetikleme bir periyot SONRADIR;
        // o zaman deploy'dan (ya da IIS uygulama havuzunun geri dönüşünden) sonra süresi
        // çoktan dolmuş müşteriler bir saat daha paketlerini kullanmaya devam ederdi.
        // Tur idempotenttir: yapacak iş yoksa tek sorguyla çıkar.
        Timer.RunOnStart = true;
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var processor = workerContext.ServiceProvider.GetRequiredService<SubscriptionExpiryProcessor>();
        await processor.RunAsync();
    }
}
