using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.EventBus.Local;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Documents;

/// <summary>
/// 🔴 DOC-05 / NTF-07 · Geçerlilik tarihi yaklaşan ya da dolan belgeleri yükleyene ve
/// (belge projeye bağlıysa) proje liderlerine duyurur: 30 gün, 7 gün, ve dolduğu gün.
///
/// <para><see cref="DocumentExpiryWorker"/>'dan AYRI: o, KLASÖR düzeyindeki eski tarihi
/// izler ve tek seferlik bir bayrakla çalışır. Kullanıcının belge ayrıntısında girdiği tarih
/// dosya düzeyindedir ve onu izleyen hiçbir şey yoktu.</para>
///
/// <para>Saatte bir koşar ama kullanıcı her eşikte yalnız BİR bildirim alır: tekillik
/// bildirim tarafında (belge + tarih + eşik). Tarama <see cref="DocumentFileExpiryScanner"/>'da;
/// bu sınıf yalnız olayları doğru kiracı bağlamında yayınlar.</para>
/// </summary>
public class DocumentFileExpiryWorker : AsyncPeriodicBackgroundWorkerBase
{
    public DocumentFileExpiryWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // 60 dakika
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var scanner = workerContext.ServiceProvider.GetRequiredService<DocumentFileExpiryScanner>();
        var localEventBus = workerContext.ServiceProvider.GetRequiredService<ILocalEventBus>();
        var currentTenant = workerContext.ServiceProvider.GetRequiredService<ICurrentTenant>();
        var clock = workerContext.ServiceProvider.GetRequiredService<IClock>();

        var results = await scanner.ScanAsync(clock.Now);

        foreach (var tenantGroup in results.GroupBy(r => r.TenantId))
        {
            try
            {
                using (currentTenant.Change(tenantGroup.Key))
                {
                    foreach (var result in tenantGroup)
                    {
                        if (result.Event.RecipientIds.Count == 0)
                        {
                            // Alıcı kümesi boşaldığında sessizce atlanmaz, loglanır (NTF-12 dersi).
                            Logger.LogWarning(
                                "DocumentFileExpiryWorker: {DocumentFileId} belgesinin geçerliliği için " +
                                "bildirilecek kimse yok (yükleyen bilinmiyor, proje lideri tanımlı değil).",
                                result.Event.DocumentFileId);
                            continue;
                        }

                        await localEventBus.PublishAsync(result.Event);
                    }
                }
            }
            catch (Exception ex)
            {
                // Bir kiracının hatası diğerlerini durdurmaz.
                Logger.LogError(ex,
                    "TenantId={TenantId}: belge geçerlilik hatırlatmaları işlenirken hata oluştu. Sonraki kiracıya geçiliyor.",
                    tenantGroup.Key);
            }
        }
    }
}
