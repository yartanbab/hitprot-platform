using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Notifications;

/// <summary>
/// Sessiz saatler (kullanıcı kararı 2026-10-19, varsayılan kapalı): pencere içinde Normal önemdeki tarayıcı
/// bildirimi pencere bitince gelir; Yüksek ve Kritik her zaman anında.
/// </summary>
public class NotificationQuietHoursDto
{
    public bool Enabled { get; set; }

    /// <summary>"HH:mm" (sunucunun yerel saati).</summary>
    [Required]
    [RegularExpression(@"^([01]\d|2[0-3]):[0-5]\d$")]
    public string Start { get; set; } = "22:00";

    /// <summary>"HH:mm"; başlangıçtan küçükse pencere gece yarısını geçer.</summary>
    [Required]
    [RegularExpression(@"^([01]\d|2[0-3]):[0-5]\d$")]
    public string End { get; set; } = "08:00";
}
