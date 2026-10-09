using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace Apya.Platform.Notifications;

/// <summary>
/// Günlük bildirim özetinin zamanlayıcısı. Saatte bir uyanır; özetin vaktinin gelip gelmediğine
/// ve neyin gönderileceğine <see cref="NotificationDigestSender"/> karar verir (son özet zamanı
/// kalıcı olduğu için uygulamanın yeniden başlaması özeti kaydırmaz).
/// </summary>
public class NotificationDigestWorker : AsyncPeriodicBackgroundWorkerBase
{
    public NotificationDigestWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // 1 saat
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        // LastOccurredAt UTC tutulur (bkz. Notification); yerel saatle kıyaslanınca
        // pencere TR'de 21 saate iniyor, aradaki bildirimler hiçbir özete girmiyordu.
        await workerContext.ServiceProvider
            .GetRequiredService<NotificationDigestSender>()
            .RunAsync(DateTime.UtcNow);
    }
}
