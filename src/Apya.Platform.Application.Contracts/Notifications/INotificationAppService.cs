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

    /// <summary>Rozet, "Önemli" bölümü ve kategori ağacı için tek çağrılık özet.</summary>
    Task<NotificationSummaryDto> GetSummaryAsync();

    /// <summary>Belirtilen bildirimi okundu olarak işaretler.</summary>
    Task MarkAsReadAsync(Guid id);

    /// <summary>Tüm okunmamış bildirimleri okundu yapar.</summary>
    Task MarkAllAsReadAsync();

    /// <summary>Yalnızca verilen kategorideki okunmamışları okundu yapar.</summary>
    Task MarkCategoryAsReadAsync(NotificationCategory category);

    /// <summary>Okunmuş bildirimleri toplu siler ("Okunmuşları temizle").</summary>
    Task<int> DeleteReadAsync();

    /// <summary>Bildirimi siler (soft delete).</summary>
    Task DeleteAsync(Guid id);
}
