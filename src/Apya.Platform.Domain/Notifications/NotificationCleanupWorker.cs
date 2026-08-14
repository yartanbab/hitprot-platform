using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Notifications;

/// <summary>
/// Eskimiş bildirimleri tablodan kalıcı olarak kaldırır.
/// <para>
/// Soft delete yetmiyor: silinen kayıt satır olarak duruyor ve global filtre
/// yüzünden bir daha sorguya girmediği için asla temizlenmiyordu. Bu yüzden
/// hem okunmuş hem de daha önce silinmiş eski kayıtlar, filtre kapatılarak
/// hard delete ediliyor.
/// </para>
/// </summary>
public class NotificationCleanupWorker : AsyncPeriodicBackgroundWorkerBase
{
    public NotificationCleanupWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        Timer.Period = 24 * 60 * 60 * 1000; // 24 saat
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var repository     = workerContext.ServiceProvider.GetRequiredService<IRepository<Notification, Guid>>();
        var clock          = workerContext.ServiceProvider.GetRequiredService<IClock>();
        var tenantFilter   = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var softDeleteFilt = workerContext.ServiceProvider.GetRequiredService<IDataFilter<ISoftDelete>>();

        var threshold = clock.Now.AddDays(-NotificationConsts.RetentionDays);

        List<Notification> stale;

        using (tenantFilter.Disable())
        using (softDeleteFilt.Disable())
        {
            stale = await repository.GetListAsync(n =>
                n.LastOccurredAt < threshold && (n.IsRead || n.IsDeleted));

            if (stale.Count == 0)
                return;

            await repository.HardDeleteAsync(stale);
        }

        Logger.LogInformation(
            "NotificationCleanupWorker: {Count} eskimiş bildirim kalıcı olarak silindi ({Days} günden eski).",
            stale.Count, NotificationConsts.RetentionDays);
    }
}
