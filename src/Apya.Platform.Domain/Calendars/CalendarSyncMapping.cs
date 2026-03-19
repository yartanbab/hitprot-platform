using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Calendars;

/// <summary>
/// Yerel bir görevi (TaskItem) dış takvimdeki bir etkinliğe (Event) bağlar.
/// 2 yönlü senkronizasyon için eşleştirme tablosudur.
/// </summary>
public class CalendarSyncMapping : FullAuditedEntity<Guid>
{
    // Yerel Görev ID
    public Guid TaskId { get; set; }
    
    // Dış takvimdeki Event ID (Google'da 'id', Outlook'ta 'id' vb.)
    public string ExternalEventId { get; set; }
    
    // Hangi dış hesapla bağlı (tek kullanıcı birden fazla Google hesabı bağlayabilir mi?)
    public Guid ExternalCalendarAccountId { get; set; }
    
    // Bu ikisi arasındaki son başarılı eşleşme zamanı (Çakışma kontrolü için)
    public DateTime LastSyncedAt { get; set; }
    
    // E-tag veya versiyon numarası (Dışarıda değişiklik olduysa pollling yaparken kontrol etmek için)
    public string ExternalETag { get; set; }

    public CalendarSyncMapping() { }

    public CalendarSyncMapping(Guid taskId, string externalEventId, Guid accountId)
    {
        TaskId = taskId;
        ExternalEventId = externalEventId;
        ExternalCalendarAccountId = accountId;
        LastSyncedAt = DateTime.Now;
    }
}
