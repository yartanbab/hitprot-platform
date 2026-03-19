using System;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Volo.Abp.Guids;

namespace Apya.Platform.Tasks;

/// <summary>
/// Bir görev atandığında tetiklenir ve atanan kişiye bildirim oluşturur.
/// </summary>
public class TaskAssignedEventHandler :
    ILocalEventHandler<TaskAssignedEto>,
    ITransientDependency
{
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IGuidGenerator _guidGenerator;

    public TaskAssignedEventHandler(
        IRepository<Notification, Guid> notificationRepository,
        IGuidGenerator guidGenerator)
    {
        _notificationRepository = notificationRepository;
        _guidGenerator          = guidGenerator;
    }

    public async Task HandleEventAsync(TaskAssignedEto eventData)
    {
        var notification = new Notification(
            id         : _guidGenerator.Create(),
            userId     : eventData.AssigneeId,
            type       : NotificationType.TaskAssigned,
            title      : "📋 Size yeni bir görev atandı",
            body       : $"\"{eventData.TaskTitle}\" görevi {eventData.AssignerName} tarafından size atandı.",
            entityType : "Task",
            entityId   : eventData.TaskId
        );

        await _notificationRepository.InsertAsync(notification);
    }
}
