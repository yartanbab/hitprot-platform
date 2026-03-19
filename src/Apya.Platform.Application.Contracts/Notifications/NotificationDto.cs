using System;
using Apya.Platform.Notifications;

namespace Apya.Platform.Notifications;

public class NotificationDto
{
    public Guid               Id           { get; set; }
    public NotificationType   Type         { get; set; }
    public string             Title        { get; set; } = string.Empty;
    public string             Body         { get; set; } = string.Empty;
    public string?            EntityType   { get; set; }
    public Guid?              EntityId     { get; set; }
    public bool               IsRead       { get; set; }
    public DateTime?          ReadAt       { get; set; }
    public DateTime           CreationTime { get; set; }

    /// <summary>İlgili entity'ye yönlendirme URL'i (frontend'de hesaplanır).</summary>
    public string? DeepLinkUrl { get; set; }
}
