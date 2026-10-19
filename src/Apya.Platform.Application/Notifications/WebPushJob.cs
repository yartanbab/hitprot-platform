using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Notifications;

public class WebPushJobArgs
{
    public Guid DeviceId { get; set; }
    public Guid? TenantId { get; set; }
    public string PayloadJson { get; set; } = string.Empty;
    public string? Topic { get; set; }
    public bool Urgent { get; set; }

    /// <summary>Yalnız sessiz saatler yüzünden ertelenen işte dolu: bildirim bu arada okunduysa push gitmez.</summary>
    public Guid? NotificationId { get; set; }
}

/// <summary>
/// NTF-08 · Tek cihaza tek bildirim. Kuyruk ve yeniden deneme ABP arka plan işlerinden gelir
/// (<c>AbpBackgroundJobs</c> tablosu, artan bekleme); yeni bir kuyruk yazılmadı.
///
/// <para>Abonelik öldüyse (404/410) cihaz pasifleştirilir ve iş BAŞARILI biter — yeniden denemek
/// anlamsızdır. Geçici hatada istisna atılır ki iş yeniden denensin.</para>
/// </summary>
public class WebPushJob : AsyncBackgroundJob<WebPushJobArgs>, ITransientDependency
{
    private readonly IRepository<NotificationDevice, Guid> _deviceRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IWebPushSender _sender;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public WebPushJob(
        IRepository<NotificationDevice, Guid> deviceRepository,
        IRepository<Notification, Guid> notificationRepository,
        IWebPushSender sender,
        ICurrentTenant currentTenant,
        IClock clock,
        IUnitOfWorkManager unitOfWorkManager)
    {
        _deviceRepository = deviceRepository;
        _notificationRepository = notificationRepository;
        _sender = sender;
        _currentTenant = currentTenant;
        _clock = clock;
        _unitOfWorkManager = unitOfWorkManager;
    }

    public override async Task ExecuteAsync(WebPushJobArgs args)
    {
        WebPushSendResult result;

        using (_currentTenant.Change(args.TenantId))
        using (var uow = _unitOfWorkManager.Begin(requiresNew: true))
        {
            var device = await _deviceRepository.FindAsync(args.DeviceId);
            if (device == null || !device.IsActive)
            {
                // İş kuyruktayken abonelikten çıkılmış ya da cihaz pasifleşmiş: gönderilmez.
                await uow.CompleteAsync();
                return;
            }

            // Sessiz saatler: sabaha ertelenen bildirim o arada uygulamada okunduysa (ya da silindiyse) ekrana düşmez.
            if (args.NotificationId is { } notificationId
                && (await _notificationRepository.FindAsync(notificationId))?.IsRead != false)
            {
                await uow.CompleteAsync();
                return;
            }

            result = await _sender.SendAsync(device, args.PayloadJson, args.Topic, args.Urgent);

            switch (result)
            {
                case WebPushSendResult.Sent:
                    device.MarkSuccess(_clock.Now);
                    break;
                case WebPushSendResult.SubscriptionGone:
                    device.MarkFailure(_clock.Now);
                    device.Deactivate("410 Gone");
                    break;
                default:
                    device.MarkFailure(_clock.Now);
                    break;
            }

            await _deviceRepository.UpdateAsync(device, autoSave: true);
            // Hata sayacı, iş yeniden denense de KALICI olmalı: önce yazılır, istisna sonra atılır.
            await uow.CompleteAsync();
        }

        if (result == WebPushSendResult.TransientFailure)
        {
            throw new WebPushTransientException(args.DeviceId);
        }
    }
}

/// <summary>Geçici gönderim hatası — arka plan işinin yeniden denemesi için.</summary>
public class WebPushTransientException : Exception
{
    public WebPushTransientException(Guid deviceId)
        : base("Web push geçici olarak gönderilemedi; yeniden denenecek. Cihaz: " + deviceId)
    {
    }
}
