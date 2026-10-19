using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Telemetry.Dtos;
using Microsoft.Extensions.Options;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Settings;

namespace Apya.Platform.Telemetry;

public partial class SystemHealthAppService
{
    /// <summary>
    /// N-10 · Bildirim kanalları. Çağıran kiracı süzgecini kapatmıştır (cihaz sayısı tüm kiracılar).
    /// </summary>
    private async Task<NotificationChannelHealthDto> GetNotificationChannelsAsync()
    {
        var now = Clock.Now;
        var jobs = await LazyServiceProvider.LazyGetRequiredService<IRepository<BackgroundJobRecord, Guid>>().GetQueryableAsync();
        var devices = await LazyServiceProvider.LazyGetRequiredService<IRepository<NotificationDevice, Guid>>().GetQueryableAsync();
        var sender = LazyServiceProvider.LazyGetRequiredService<IEmailSender>();

        return new NotificationChannelHealthDto
        {
            WebPushEnabled = LazyServiceProvider.LazyGetRequiredService<IOptions<WebPushOptions>>().Value.IsEnabled,
            PushDeviceCount = await AsyncExecuter.CountAsync(devices),
            EmailSender = sender is NullEmailSender ? "Null"
                : sender.GetType().Name.Contains("FileDrop") ? "FileDrop" : "Smtp",
            EmailHost = await LazyServiceProvider.LazyGetRequiredService<ISettingProvider>()
                .GetOrNullAsync(EmailSettingNames.Smtp.Host),
            PendingJobCount = await AsyncExecuter.CountAsync(jobs.Where(j => !j.IsAbandoned)),
            OverdueJobCount = await AsyncExecuter.CountAsync(
                jobs.Where(j => !j.IsAbandoned && j.NextTryTime < now.AddMinutes(-1))),
            AbandonedJobCount24h = await AsyncExecuter.CountAsync(
                jobs.Where(j => j.IsAbandoned && j.LastTryTime != null && j.LastTryTime >= now.AddHours(-24)))
        };
    }
}
