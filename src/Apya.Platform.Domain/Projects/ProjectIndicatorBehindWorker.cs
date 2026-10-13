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
/// PRJ-08 · Hedef tarihi geçmiş, hedefe ulaşmamış göstergeleri proje liderlerine ve projeyi
/// açana duyurur.
///
/// <para>Saatte bir koşar ama kullanıcı gösterge + hedef tarihi başına yalnız BİR bildirim alır
/// (tekillik bildirim tarafında). Tarama <see cref="ProjectIndicatorBehindScanner"/>'da; bu sınıf
/// yalnız olayları doğru kiracı bağlamında yayınlar.</para>
/// </summary>
public class ProjectIndicatorBehindWorker : AsyncPeriodicBackgroundWorkerBase
{
    public ProjectIndicatorBehindWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // 60 dakika
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var scanner = workerContext.ServiceProvider.GetRequiredService<ProjectIndicatorBehindScanner>();
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
                            Logger.LogWarning(
                                "ProjectIndicatorBehindWorker: {IndicatorId} göstergesi geride ama bildirilecek " +
                                "kimse yok (lider tanımlı değil, projeyi açan bilinmiyor).",
                                result.Event.IndicatorId);
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
                    "TenantId={TenantId}: geride gösterge bildirimleri işlenirken hata oluştu. Sonraki kiracıya geçiliyor.",
                    tenantGroup.Key);
            }
        }
    }
}
