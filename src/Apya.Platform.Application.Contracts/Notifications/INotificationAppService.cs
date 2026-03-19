using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Notifications;

public interface INotificationAppService : IApplicationService
{
    /// <summary>Mevcut kullanıcının bildirimlerini sayfalı getirir.</summary>
    Task<PagedResultDto<NotificationDto>> GetMyNotificationsAsync(GetNotificationsInput input);

    /// <summary>Okunmamış bildirim sayısını döner (navbar badge için).</summary>
    Task<int> GetUnreadCountAsync();

    /// <summary>Belirtilen bildirimi okundu olarak işaretler.</summary>
    Task MarkAsReadAsync(Guid id);

    /// <summary>Tüm okunmamış bildirimleri okundu yapar.</summary>
    Task MarkAllAsReadAsync();

    /// <summary>Bildirimi siler (soft delete).</summary>
    Task DeleteAsync(Guid id);
}
