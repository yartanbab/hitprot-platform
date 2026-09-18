using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Volo.Abp.DependencyInjection;
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

    public SignalRNotificationEventHandler(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
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
    public async Task HandleEventAsync(NotificationCreatedEto eventData)
    {
        await _hubContext.Clients.User(eventData.UserId.ToString())
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
            });
    }

    /// <summary>Okundu/silindi → kullanıcının tüm açık sekmeleri rozeti tazelesin.</summary>
    public async Task HandleEventAsync(NotificationCountChangedEto eventData)
    {
        await _hubContext.Clients.User(eventData.UserId.ToString())
            .SendAsync("NotificationCountChanged");
    }
}
