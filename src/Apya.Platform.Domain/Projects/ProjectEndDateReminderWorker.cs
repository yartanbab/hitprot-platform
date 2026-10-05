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

namespace Apya.Platform.Projects;

/// <summary>
/// 🔴 NTF-05 · Bitişi yaklaşan projeleri proje liderlerine ve projeyi açana duyurur
/// (30 / 14 / 3 gün eşikleri).
///
/// <para>Saatte bir koşar ama kullanıcı her eşikte yalnız BİR bildirim alır: tekillik
/// bildirim tarafında (proje + bitiş tarihi + eşik). Saatlik koşmasının sebebi, eşiğe
/// girilen günün içinde gecikmeden yakalamak; aynı eşiği yeniden bildirmek değil.</para>
///
/// <para>Tarama <see cref="ProjectEndDateReminderScanner"/>'da; bu sınıf yalnız
/// olayları doğru kiracı bağlamında yayınlar.</para>
/// </summary>
public class ProjectEndDateReminderWorker : AsyncPeriodicBackgroundWorkerBase
{
    public ProjectEndDateReminderWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // 60 dakika
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var scanner = workerContext.ServiceProvider.GetRequiredService<ProjectEndDateReminderScanner>();
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
                            // NTF-12 dersi: alıcı kümesi boşaldığında sessizce atlanmaz, loglanır.
                            Logger.LogWarning(
                                "ProjectEndDateReminderWorker: {ProjectId} projesinin bitişine {Days} gün kaldı " +
                                "ama bildirilecek kimse yok (lider tanımlı değil, projeyi açan bilinmiyor).",
                                result.Event.ProjectId, result.Event.DaysRemaining);
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
                    "TenantId={TenantId}: proje bitiş hatırlatmaları işlenirken hata oluştu. Sonraki kiracıya geçiliyor.",
                    tenantGroup.Key);
            }
        }
    }
}
