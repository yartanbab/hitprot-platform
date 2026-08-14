namespace Apya.Platform.Notifications;

/// <summary>
/// Bildirimin aciliyeti. Sayısal değer artan önemi ifade eder — sıralamada
/// doğrudan <c>OrderByDescending</c> ile kullanılır.
/// </summary>
public enum NotificationSeverity
{
    /// <summary>Bilgilendirme; rozet sayısını artırır ama vurgulanmaz.</summary>
    Info     = 1,
    Normal   = 2,
    High     = 3,
    /// <summary>Kaçırılmaması gereken; listede en üstte gösterilir.</summary>
    Critical = 4
}
