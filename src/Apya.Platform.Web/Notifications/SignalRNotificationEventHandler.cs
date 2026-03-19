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
    ILocalEventHandler<TaskAssignedEto>,
    ILocalEventHandler<TaskCommentAddedEto>,
    ITransientDependency
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public SignalRNotificationEventHandler(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    // --- Görev Atandığında ---
    public async Task HandleEventAsync(TaskAssignedEto eventData)
    {
        await _hubContext.Clients.User(eventData.AssigneeId.ToString())
            .SendAsync("ReceiveNotification", new 
            {
                title = "📋 Yeni Görev",
                body = $"\"{eventData.TaskTitle}\" size atandı.",
                entityType = "Task",
                entityId = eventData.TaskId
            });
    }

    // --- Yorum Yapıldığında ---
    public async Task HandleEventAsync(TaskCommentAddedEto eventData)
    {
        // Alıcıları (Yorumu yapan hariç) bul
        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.CommentUserId)
        {
            await SendAsync(eventData.AssigneeId.Value, eventData);
        }

        if (eventData.CreatorId.HasValue && eventData.CreatorId != eventData.CommentUserId && eventData.CreatorId != eventData.AssigneeId)
        {
            await SendAsync(eventData.CreatorId.Value, eventData);
        }
    }

    private async Task SendAsync(Guid userId, TaskCommentAddedEto eventData)
    {
         await _hubContext.Clients.User(userId.ToString())
            .SendAsync("ReceiveNotification", new 
            {
                title = "💬 Görev Yorumu",
                body = $"{eventData.CommenterName}: {eventData.CommentText}",
                entityType = "Task",
                entityId = eventData.TaskId
            });
    }
}
