using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Calendars;

/// <summary>
/// Senkron günlüğü satırı — "14 öğe Google Calendar'a yazıldı", "1 çakışma çözüldü",
/// "yetki süresi doldu, 1 öğe yazılamadı".
/// <para>
/// Neden saklanıyor: senkron arka planda ve sessizce çalışır. Kullanıcı bir öğenin
/// neden dış takvimde görünmediğini ancak buradan anlayabilir; toast'lar o an
/// ekranda değilse kaybolur.
/// </para>
/// </summary>
public class CalendarSyncLogEntry : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid ExternalCalendarAccountId { get; private set; }

    public CalendarSyncLogKind Kind { get; private set; }

    /// <summary>Kullanıcıya gösterilen satır metni (hangi öğe, hangi hata).</summary>
    public string Message { get; private set; } = string.Empty;

    /// <summary>Kaç öğe etkilendi — "14 öğe yazıldı" gibi satırlarda kullanılır.</summary>
    public int ItemCount { get; private set; }

    protected CalendarSyncLogEntry() { }

    public CalendarSyncLogEntry(
        Guid id,
        Guid? tenantId,
        Guid accountId,
        CalendarSyncLogKind kind,
        string message,
        int itemCount = 0) : base(id)
    {
        TenantId                  = tenantId;
        ExternalCalendarAccountId = accountId;
        Kind                      = kind;
        Message                   = message?.Trim() ?? string.Empty;
        ItemCount                 = itemCount < 0 ? 0 : itemCount;
    }
}
