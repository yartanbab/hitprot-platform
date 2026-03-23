using System;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.EventBus.Local;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Notifications;

public class NotificationManager : DomainService
{
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly ILocalEventBus _localEventBus;

    public NotificationManager(
        IRepository<Notification, Guid> notificationRepository,
        ILocalEventBus localEventBus)
    {
        _notificationRepository = notificationRepository;
        _localEventBus = localEventBus;
    }

    /// <summary>
    /// Bildirimi hem veritabanına kaydeder hem de anlık SignalR bildirimi için event fırlatır.
    /// </summary>
    public async Task PublishAsync(
        Guid userId,
        string title,
        string body,
        NotificationType type,
        string? entityType = null,
        Guid? entityId = null)
    {
        // 1. Veritabanına kaydet
        var notification = new Notification(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            userId,
            type,
            title,
            body,
            entityType,
            entityId
        );

        await _notificationRepository.InsertAsync(notification);

        // 2. SignalR event fırlat (Web katmanı dinleyecek)
        await _localEventBus.PublishAsync(new NotificationCreatedEto
        {
            TenantId = CurrentTenant.Id,
            UserId = userId,
            Title = title,
            Body = body,
            EntityType = entityType,
            EntityId = entityId,
            Type = type
        });
    }
}

public class NotificationCreatedEto
{
    public Guid? TenantId { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public NotificationType Type { get; set; }
}
