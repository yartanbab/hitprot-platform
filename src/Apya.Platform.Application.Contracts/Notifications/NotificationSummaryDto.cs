using System.Collections.Generic;

namespace Apya.Platform.Notifications;

/// <summary>
/// Zil rozeti ve bildirim merkezinin sol ağacı tek çağrıda bundan beslenir —
/// kategori başına ayrı sayım isteği atılmasın diye.
/// </summary>
public class NotificationSummaryDto
{
    public int TotalUnread { get; set; }

    /// <summary>Yüksek ve kritik olanlar — zil panelindeki "Önemli" bölümünün sayacı.</summary>
    public int ImportantUnread { get; set; }

    public List<NotificationCategoryCountDto> Categories { get; set; } = new();
}

public class NotificationCategoryCountDto
{
    public NotificationCategory Category { get; set; }
    public int UnreadCount { get; set; }
}
