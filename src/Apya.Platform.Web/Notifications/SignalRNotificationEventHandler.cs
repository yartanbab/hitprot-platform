using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Uow;
using Volo.Abp.EventBus;
using Apya.Platform.Web.Hubs;
using Apya.Platform.Tasks;
using Apya.Platform.Notifications;

namespace Apya.Platform.Web.Notifications;

/// <summary>
/// Web katmanındaki bu handler, domain event'leri dinleyip SignalR üzerinden anlık yayın yapar.
/// </summary>
public class SignalRNotificationEventHandler :
    ILocalEventHandler<NotificationCreatedEto>,
    ILocalEventHandler<NotificationCountChangedEto>,
    ITransientDependency
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IUnitOfWorkManager _unitOfWorkManager;
    private readonly ILogger<SignalRNotificationEventHandler> _logger;

    public SignalRNotificationEventHandler(
        IHubContext<NotificationHub> hubContext,
        IUnitOfWorkManager unitOfWorkManager,
        ILogger<SignalRNotificationEventHandler> logger)
    {
        _hubContext = hubContext;
        _unitOfWorkManager = unitOfWorkManager;
        _logger = logger;
    }

    /// <summary>
    /// N-01 · Yayın COMMIT'TEN SONRA ve hata yutularak yapılır. Yerel olaylar iş biriminin
    /// tamamlanması sırasında, commit'ten ÖNCE işlenir: (1) istemci zile hemen sayacı sorduğunda
    /// satır henüz yazılmamış olabiliyordu, (2) hub hatası (bağlantı, serileştirme) kullanıcının
    /// asıl işlemini (yorum, atama…) geri alabiliyordu. Bildirim bir yan etkidir; asıl işi bozamaz.
    /// </summary>
    private Task AfterCommitAsync(Func<Task> send)
    {
        var uow = _unitOfWorkManager.Current;
        if (uow == null)
        {
            return SafeSendAsync(send);
        }

        uow.OnCompleted(() => SafeSendAsync(send));
        return Task.CompletedTask;
    }

    private async Task SafeSendAsync(Func<Task> send)
    {
        try
        {
            await send();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Anlık bildirim (SignalR) gönderilemedi; bildirim kaydı ve zil sayacı etkilenmez.");
        }
    }

    /// <summary>
    /// Payload'daki alan adları <c>wwwroot/Pages/Notifications/notification-bell.js</c>
    /// ile SÖZLEŞMEDİR; derleyici bu bağı görmez. Bir alanı yeniden adlandırmak
    /// istemcide sessizce <c>undefined</c> üretir — bu yüzden
    /// <c>NotificationSignalRContract_Tests</c> iki tarafı kaynaktan okuyup karşılaştırır.
    ///
    /// <para><c>deepLinkUrl</c> sunucuda türetiliyor (saklanmıyor): istemci türden
    /// adres kurmaya çalışmasın, derin link kuralı tek yerde
    /// (<see cref="NotificationTypeRegistry"/>) kalsın.</para>
    /// </summary>
    public Task HandleEventAsync(NotificationCreatedEto eventData)
    {
        return AfterCommitAsync(() => _hubContext.Clients.User(eventData.UserId.ToString())
            .SendAsync("ReceiveNotification", new
            {
                id = eventData.Id,
                title = eventData.Title,
                body = eventData.Body,
                entityType = eventData.EntityType,
                entityId = eventData.EntityId,
                type = (int)eventData.Type,
                severity = (int)eventData.Severity,
                deepLinkUrl = NotificationTypeRegistry.BuildDeepLink(eventData.Type, eventData.EntityId)
            }));
    }

    /// <summary>Okundu/silindi → kullanıcının tüm açık sekmeleri rozeti tazelesin.</summary>
    public Task HandleEventAsync(NotificationCountChangedEto eventData)
    {
        return AfterCommitAsync(() => _hubContext.Clients.User(eventData.UserId.ToString())
            .SendAsync("NotificationCountChanged"));
    }
}
