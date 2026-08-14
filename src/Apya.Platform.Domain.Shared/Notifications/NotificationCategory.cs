namespace Apya.Platform.Notifications;

/// <summary>
/// Bildirimin ait olduğu üst seviye alan. Bildirim merkezinde sekme/ağaç başlığı,
/// zil panelinde ise satır ikonunun kaynağıdır.
/// </summary>
public enum NotificationCategory
{
    Tasks     = 1,
    Projects  = 2,
    Documents = 3,
    Grants    = 4,
    Ai        = 5,
    Feedback  = 6,
    /// <summary>Sınıflandırılmamış — kaydı olmayan türler buraya düşer.</summary>
    System    = 7
}
