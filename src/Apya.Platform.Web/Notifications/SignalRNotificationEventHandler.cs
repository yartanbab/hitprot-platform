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
    ITransientDependency
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationEventHandler(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task HandleEventAsync(NotificationCreatedEto eventData)
    {
        await _hubContext.Clients.User(eventData.UserId.ToString())
            .SendAsync("ReceiveNotification", new 
            {
                title = eventData.Title,
                body = eventData.Body,
                entityType = eventData.EntityType,
                entityId = eventData.EntityId,
                type = (int)eventData.Type
            });
    }
}
