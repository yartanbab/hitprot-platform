using System;
using Apya.Platform.Notifications;

namespace Apya.Platform.Notifications;

public class NotificationDto
{
    public Guid                 Id           { get; set; }
    public NotificationType     Type         { get; set; }
    public NotificationCategory Category     { get; set; }
    public NotificationSeverity Severity     { get; set; }
    public string               Title        { get; set; } = string.Empty;
    public string               Body         { get; set; } = string.Empty;
    public string?              EntityType   { get; set; }
    public Guid?                EntityId     { get; set; }
    public bool                 IsRead       { get; set; }
    public DateTime?            ReadAt       { get; set; }
    public DateTime             CreationTime { get; set; }

    /// <summary>Gruptaki son olayın zamanı — listede sıralama bunun üzerinden yapılır.</summary>
    public DateTime LastOccurredAt { get; set; }

    /// <summary>Bu satırın temsil ettiği olay sayısı; 1'den büyükse "3 yeni yorum" gösterilir.</summary>
    public int OccurrenceCount { get; set; }

    /// <summary>Olayı tetikleyen kişi (worker kaynaklı bildirimlerde null).</summary>
    public string? ActorName { get; set; }

    /// <summary>Satır ikonu (FontAwesome sınıfı) — türün kaydından gelir.</summary>
    public string Icon { get; set; } = string.Empty;

    /// <summary>İlgili kayda yönlendirme adresi; null ise satır tıklanabilir değildir.</summary>
    public string? DeepLinkUrl { get; set; }
}
