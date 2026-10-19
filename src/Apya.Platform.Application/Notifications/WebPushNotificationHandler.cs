using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SettingManagement;
using Volo.Abp.Timing;
using Apya.Platform.Settings;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Üretilen her bildirimi kullanıcının etkin cihazlarına da gönderir.
///
/// <para><c>NotificationManager</c>'a DOKUNULMADI: push, uygulama içi bildirimle AYNI olaydan
/// (<see cref="NotificationCreatedEto"/>) beslenir. Böylece push yeni bir alıcı kitlesi üretmez —
/// kategori sessize alındıysa ya da kullanıcı alıcı değilse olay hiç doğmaz.</para>
///
/// <para>Bastırma (uygulama gözün önündeyse gösterme) burada DEĞİL, service worker'dadır: sunucu
/// soketin açık olduğunu bilir, sekmenin görünür olduğunu bilmez.</para>
///
/// <para>Sessiz saatler (kullanıcı kararı 2026-10-19): kullanıcı açtıysa pencere içindeki Normal ve daha düşük
/// önemdeki push, pencere bitince gönderilmek üzere ertelenir; Yüksek/Kritik her zaman anında.</para>
/// </summary>
public class WebPushNotificationHandler : ILocalEventHandler<NotificationCreatedEto>, ITransientDependency
{
    private readonly IRepository<NotificationDevice, Guid> _deviceRepository;
    private readonly IRepository<NotificationPreference, Guid> _preferenceRepository;
    private readonly IBackgroundJobManager _backgroundJobManager;
    private readonly ICurrentTenant _currentTenant;
    private readonly WebPushOptions _options;
    private readonly ISettingManager _settingManager;
    private readonly IClock _clock;
    private readonly ILogger<WebPushNotificationHandler> _logger;

    public WebPushNotificationHandler(
        IRepository<NotificationDevice, Guid> deviceRepository,
        IRepository<NotificationPreference, Guid> preferenceRepository,
        IBackgroundJobManager backgroundJobManager,
        ICurrentTenant currentTenant,
        IOptions<WebPushOptions> options,
        ISettingManager settingManager,
        IClock clock,
        ILogger<WebPushNotificationHandler> logger)
    {
        _deviceRepository = deviceRepository;
        _preferenceRepository = preferenceRepository;
        _backgroundJobManager = backgroundJobManager;
        _currentTenant = currentTenant;
        _options = options.Value;
        _settingManager = settingManager;
        _clock = clock;
        _logger = logger;
    }

    public async Task HandleEventAsync(NotificationCreatedEto eventData)
    {
        if (!_options.IsEnabled)
        {
            return;
        }

        try
        {
            using (_currentTenant.Change(eventData.TenantId))
            {
                var info = NotificationTypeRegistry.Get(eventData.Type);

                var preference = await _preferenceRepository.FirstOrDefaultAsync(
                    p => p.UserId == eventData.UserId && p.Category == info.Category);
                if (!(preference?.Push ?? NotificationPreferenceDefaults.Push))
                {
                    return;
                }

                var devices = await _deviceRepository.GetListAsync(
                    d => d.UserId == eventData.UserId && d.IsActive
                         && d.Platform == NotificationDevicePlatform.WebPush);
                if (devices.Count == 0)
                {
                    return;
                }

                var severity = eventData.Severity;
                var titleOnly = await TitleOnlyAsync(eventData.UserId);
                var payload = WebPushPayload.Build(
                    eventData.Id, eventData.Title, titleOnly ? null : eventData.Body, tag: null, severity,
                    NotificationTypeRegistry.BuildDeepLink(eventData.Type, eventData.EntityId) ?? "/Notifications");

                // N-02 · Acil (Yüksek/Kritik) push kuyrukta öne geçer: geniş dağıtımda (kiracının bütün
                // kullanıcıları) sıradan bildirimlerin arkasında beklemesin.
                var urgent = severity >= NotificationSeverity.High;
                TimeSpan? delay = urgent ? null : await QuietDelayAsync(eventData.UserId);
                foreach (var device in devices)
                {
                    await _backgroundJobManager.EnqueueAsync(new WebPushJobArgs
                    {
                        DeviceId = device.Id,
                        TenantId = eventData.TenantId,
                        PayloadJson = payload,
                        Topic = WebPushPayload.Topic(eventData.Id),
                        Urgent = urgent,
                        NotificationId = delay.HasValue ? eventData.Id : null,
                    }, urgent ? BackgroundJobPriority.High : BackgroundJobPriority.Normal, delay);
                }
            }
        }
        catch (Exception ex)
        {
            // Push altyapısı bildirim akışını kırmamalı: kayıt atıldı, kullanıcı uygulama içinde görecek.
            _logger.LogWarning(ex, "Web push kuyruğa alınamadı. UserId: {UserId}", eventData.UserId);
        }
    }

    /// <summary>Kilit ekranı tercihi: "yalnız başlık" seçtiyse gövde push'a girmez.</summary>
    private async Task<bool> TitleOnlyAsync(Guid userId)
    {
        var value = await _settingManager.GetOrNullForUserAsync(PlatformSettings.NotificationLockScreen.TitleOnly, userId);
        return bool.TryParse(value, out var titleOnly) ? titleOnly : PlatformSettingDefaults.NotificationPushTitleOnly;
    }

    /// <summary>Kullanıcının sessiz saatleri açık ve şu an pencerenin içindeyse bitişe kalan süre.</summary>
    private async Task<TimeSpan?> QuietDelayAsync(Guid userId)
    {
        var enabled = await _settingManager.GetOrNullForUserAsync(PlatformSettings.NotificationQuietHours.Enabled, userId);
        if (!bool.TryParse(enabled, out var on) || !on)
        {
            return null;
        }

        var window = await _settingManager.GetOrNullForUserAsync(PlatformSettings.NotificationQuietHours.Window, userId);
        return QuietHoursWindow.TryParse(window, out var parsed) ? parsed.DelayUntilEnd(_clock.Now) : null;
    }
}
