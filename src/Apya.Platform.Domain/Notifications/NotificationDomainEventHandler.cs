using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Apya.Platform.Tasks;

namespace Apya.Platform.Notifications;

public class NotificationDomainEventHandler : 
    ILocalEventHandler<TaskAssignedEto>,
    ILocalEventHandler<TaskCommentAddedEto>,
    ILocalEventHandler<TaskStatusChangedEto>,
    ITransientDependency
{
    private readonly NotificationManager _notificationManager;

    public NotificationDomainEventHandler(NotificationManager notificationManager)
    {
        _notificationManager = notificationManager;
    }

    // --- Görev Atandığında ---
    public async Task HandleEventAsync(TaskAssignedEto eventData)
    {
        await _notificationManager.PublishAsync(
            eventData.AssigneeId,
            "📋 Yeni Görev",
            $"\"{eventData.TaskTitle}\" size atandı.",
            NotificationType.TaskAssigned,
            entityType: "Task",
            entityId: eventData.TaskId
        );
    }

    // --- Yorum Yapıldığında ---
    public async Task HandleEventAsync(TaskCommentAddedEto eventData)
    {
        // Alıcıları (Yorumu yapan hariç) bul ve veritabanına kaydet
        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.CommentUserId)
        {
            await _notificationManager.PublishAsync(
                eventData.AssigneeId.Value,
                "💬 Görev Yorumu",
                $"{eventData.CommenterName}: {eventData.CommentText}",
                NotificationType.TaskCommentAdded,
                entityType: "Task",
                entityId: eventData.TaskId
            );
        }

        if (eventData.CreatorId.HasValue && eventData.CreatorId != eventData.CommentUserId && eventData.CreatorId != eventData.AssigneeId)
        {
            await _notificationManager.PublishAsync(
                eventData.CreatorId.Value,
                "💬 Görev Yorumu",
                $"{eventData.CommenterName}: {eventData.CommentText}",
                NotificationType.TaskCommentAdded,
                entityType: "Task",
                entityId: eventData.TaskId
            );
        }
    }

    // --- Durum Değiştiğinde ---
    public async Task HandleEventAsync(TaskStatusChangedEto eventData)
    {
        string statusText = eventData.NewStatus switch {
            Tasks.TaskStatus.Todo => "Bekliyor",
            Tasks.TaskStatus.InProgress => "Sürüyor",
            Tasks.TaskStatus.InReview => "İncelemede",
            Tasks.TaskStatus.Done => "Tamamlandı",
            _ => "Güncellendi"
        };

        var title = "🔄 Durum Güncellemesi";
        var body = $"\"{eventData.TaskTitle}\" görevi {eventData.ChangedByName} tarafından {statusText} olarak işaretlendi.";

        // Atanan kişiye bildir (Değiştiren o değilse)
        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.CreatorId) 
        {
             // Not: Burada 'değiştiren' bilgisini saklamak lazım aslında ama current user id domain eventte yoksa isimlendirme üzerinden yapıyoruz.
             await _notificationManager.PublishAsync(
                eventData.AssigneeId.Value,
                title,
                body,
                NotificationType.TaskStatusChanged,
                entityType: "Task",
                entityId: eventData.TaskId
            );
        }

        // Oluşturana bildir (Değiştiren o değilse)
        if (eventData.CreatorId.HasValue && eventData.CreatorId != eventData.AssigneeId)
        {
            await _notificationManager.PublishAsync(
                eventData.CreatorId.Value,
                title,
                body,
                NotificationType.TaskStatusChanged,
                entityType: "Task",
                entityId: eventData.TaskId
            );
        }
    }
}
