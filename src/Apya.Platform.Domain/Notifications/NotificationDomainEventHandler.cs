using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Apya.Platform.Localization;
using Apya.Platform.Tasks;
using Apya.Platform.Documents;

namespace Apya.Platform.Notifications;

public class NotificationDomainEventHandler :
    ILocalEventHandler<TaskAssignedEto>,
    ILocalEventHandler<TaskCommentAddedEto>,
    ILocalEventHandler<TaskStatusChangedEto>,
    ILocalEventHandler<TaskDueSoonEto>,
    ILocalEventHandler<DocumentExpiringEto>,
    ITransientDependency
{
    private readonly NotificationManager _notificationManager;
    private readonly IStringLocalizer<PlatformResource> _l;

    public NotificationDomainEventHandler(
        NotificationManager notificationManager,
        IStringLocalizer<PlatformResource> l)
    {
        _notificationManager = notificationManager;
        _l = l;
    }

    public async Task HandleEventAsync(TaskAssignedEto eventData)
    {
        // Eğer atanan kişi kendisi atadıysa bildirim gönderme
        if (eventData.AssigneeId == eventData.ModifierUserId) return;

        await _notificationManager.PublishAsync(
            eventData.AssigneeId,
            _l["Notification:TaskAssigned:Title"],
            _l["Notification:TaskAssigned:Body", eventData.TaskTitle],
            NotificationType.TaskAssigned,
            entityType: "Task",
            entityId: eventData.TaskId
        );
    }

    // --- Yorum Yapıldığında ---
    public async Task HandleEventAsync(TaskCommentAddedEto eventData)
    {
        // Alıcıları (Yorumu yapan hariç) bul ve veritabanına kaydet
        var title = _l["Notification:TaskComment:Title"];
        var body  = _l["Notification:TaskComment:Body", eventData.CommenterName, eventData.CommentText];

        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.CommentUserId)
        {
            await _notificationManager.PublishAsync(
                eventData.AssigneeId.Value,
                title,
                body,
                NotificationType.TaskCommentAdded,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: eventData.CommentUserId,
                actorName: eventData.CommenterName
            );
        }

        if (eventData.CreatorId.HasValue && eventData.CreatorId != eventData.CommentUserId && eventData.CreatorId != eventData.AssigneeId)
        {
            await _notificationManager.PublishAsync(
                eventData.CreatorId.Value,
                title,
                body,
                NotificationType.TaskCommentAdded,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: eventData.CommentUserId,
                actorName: eventData.CommenterName
            );
        }
    }

    // --- Durum Değiştiğinde ---
    public async Task HandleEventAsync(TaskStatusChangedEto eventData)
    {
        string statusText = eventData.NewStatus switch {
            Tasks.TaskStatus.Todo       => _l["Tasks:Status:Todo"],
            Tasks.TaskStatus.InProgress => _l["Tasks:Status:InProgress"],
            Tasks.TaskStatus.InReview   => _l["Tasks:Status:InReview"],
            Tasks.TaskStatus.Done       => _l["Tasks:Status:Done"],
            _                           => _l["Notification:TaskStatus:Generic"]
        };

        var title = _l["Notification:TaskStatus:Title"];
        var body  = _l["Notification:TaskStatus:Body", eventData.TaskTitle, eventData.ChangedByName, statusText];

        // Atanan kişiye bildir (Değiştiren o değilse)
        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.ModifierUserId)
        {
             await _notificationManager.PublishAsync(
                eventData.AssigneeId.Value,
                title,
                body,
                NotificationType.TaskStatusChanged,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: eventData.ModifierUserId,
                actorName: eventData.ChangedByName
            );
        }

        // Oluşturana bildir (Değiştiren o değilse ve atanan kişiyle aynı değilse [zaten atanan kişiye yukarıda gitti])
        if (eventData.CreatorId.HasValue && 
            eventData.CreatorId != eventData.ModifierUserId && 
            eventData.CreatorId != eventData.AssigneeId)
        {
            await _notificationManager.PublishAsync(
                eventData.CreatorId.Value,
                title,
                body,
                NotificationType.TaskStatusChanged,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: eventData.ModifierUserId,
                actorName: eventData.ChangedByName
            );
        }
    }

    // --- Deadline Uyarıları (FEA-002) ---
    public async Task HandleEventAsync(TaskDueSoonEto eventData)
    {
        // Yalnızca atanan biri varsa bildirim gönder
        if (eventData.AssigneeId != Guid.Empty)
        {
            await _notificationManager.PublishAsync(
                eventData.AssigneeId,
                _l["Notification:TaskDueSoon:Title"],
                _l["Notification:TaskDueSoon:Body", eventData.TaskTitle],
                NotificationType.TaskDueSoon,
                entityType: "Task",
                entityId: eventData.TaskId
            );
        }
    }

    // --- Belge Son Tarih Uyarısı ---
    public async Task HandleEventAsync(DocumentExpiringEto eventData)
    {
        await _notificationManager.PublishAsync(
            eventData.CreatorId,
            _l["Notification:DocumentExpiring:Title"],
            _l["Notification:DocumentExpiring:Body", eventData.DocumentTitle],
            NotificationType.DocumentExpiring,
            entityType: "Document",
            entityId: eventData.DocumentId
        );
    }
}
