using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Calendars;

/// <summary>
/// Yerel bir görevi (TaskItem) dış takvimdeki bir etkinliğe (Event) bağlar.
/// </summary>
public class CalendarSyncMapping : FullAuditedEntity<Guid>
{
    public Guid TaskId { get; set; }
    public string ExternalEventId { get; set; } = null!;
    public Guid ExternalCalendarAccountId { get; set; }
    public DateTime LastSyncedAt { get; set; }
    public string? ExternalETag { get; set; }

    public CalendarSyncMapping() { }

    // ARCH-049: Domain entity IClock inject edemez; çağıran (CalendarManager) Clock.Now geçirir.
    public CalendarSyncMapping(Guid taskId, string externalEventId, Guid accountId, DateTime syncedAt)
    {
        TaskId = taskId;
        ExternalEventId = externalEventId;
        ExternalCalendarAccountId = accountId;
        LastSyncedAt = syncedAt;
    }
}
