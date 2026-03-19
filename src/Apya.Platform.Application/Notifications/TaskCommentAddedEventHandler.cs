using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Volo.Abp.Guids;

namespace Apya.Platform.Tasks;

/// <summary>
/// Bir göreve yorum eklendiğinde tetiklenir.
/// Görevi oluşturan ve atanan kişiye bildirim gönderir (yorumu yapan hariç).
/// </summary>
public class TaskCommentAddedEventHandler :
    ILocalEventHandler<TaskCommentAddedEto>,
    ITransientDependency
{
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IGuidGenerator _guidGenerator;

    public TaskCommentAddedEventHandler(
        IRepository<Notification, Guid> notificationRepository,
        IGuidGenerator guidGenerator)
    {
        _notificationRepository = notificationRepository;
        _guidGenerator          = guidGenerator;
    }

    public async Task HandleEventAsync(TaskCommentAddedEto eventData)
    {
        // Bildirim alacak benzersiz kişileri hesapla (yorumu yapan hariç)
        var recipients = new HashSet<Guid>();

        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.CommentUserId)
            recipients.Add(eventData.AssigneeId.Value);

        if (eventData.CreatorId.HasValue && eventData.CreatorId != eventData.CommentUserId)
            recipients.Add(eventData.CreatorId.Value);

        var notifications = new List<Notification>();

        foreach (var userId in recipients)
        {
            var preview = eventData.CommentText.Length > 80
                ? eventData.CommentText[..80] + "…"
                : eventData.CommentText;

            notifications.Add(new Notification(
                id         : _guidGenerator.Create(),
                userId     : userId,
                type       : NotificationType.TaskCommentAdded,
                title      : $"💬 \"{eventData.TaskTitle}\" görevine yorum yapıldı",
                body       : $"{eventData.CommenterName}: {preview}",
                entityType : "Task",
                entityId   : eventData.TaskId
            ));
        }

        if (notifications.Count > 0)
            await _notificationRepository.InsertManyAsync(notifications);
    }
}
