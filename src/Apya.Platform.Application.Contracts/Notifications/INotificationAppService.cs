using System;
using System.Collections.Generic;
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

    /// <summary>Tüm kategoriler için etkin kanal tercihleri (kayıt yoksa varsayılan).</summary>
    Task<List<NotificationPreferenceDto>> GetPreferencesAsync();

    /// <summary>Bir kategorinin kanal tercihini kaydeder.</summary>
    Task UpdatePreferenceAsync(UpdateNotificationPreferenceInput input);

    /// <summary>Sessiz saatler (kullanıcı ayarı; kayıt yoksa kapalı, 22:00–08:00).</summary>
    Task<NotificationQuietHoursDto> GetQuietHoursAsync();

    /// <summary>Sessiz saatleri kaydeder. Başlangıç ile bitiş aynı olamaz.</summary>
    Task UpdateQuietHoursAsync(NotificationQuietHoursDto input);

    /// <summary>Kilit ekranı içeriği (kişisel tercih).</summary>
    Task<NotificationLockScreenDto> GetLockScreenAsync();

    Task UpdateLockScreenAsync(NotificationLockScreenDto input);

    /// <summary>Bildirimi siler (soft delete).</summary>
    Task DeleteAsync(Guid id);
}
