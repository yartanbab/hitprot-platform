using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Telemetry;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>
/// Geri bildirim modülünün yapılandırması. Hiçbiri koda gömülü değildir;
/// hepsi ABP Setting olarak saklanır ve yönetici ekranından değiştirilebilir.
/// </summary>
public class FeedbackSettingsDto
{
    public bool TriggerEnabled { get; set; }

    /// <summary>"header" veya "floating".</summary>
    [StringLength(16)]
    public string TriggerPlacement { get; set; } = "header";

    /// <summary>Formda seçilebilen türler. Boş liste = tüm türler açık.</summary>
    public List<FeedbackType> EnabledTypes { get; set; } = new();

    [Range(1, 50)]
    public int MaxFileSizeMb { get; set; }

    /// <summary>Virgülle ayrık, noktalı uzantılar: ".png,.jpg".</summary>
    [StringLength(512)]
    public string AllowedFileExtensions { get; set; } = string.Empty;

    public bool AllowAnonymous { get; set; }

    /// <summary>Telemetri açık mı? (Sistem Sağlığı ile ortak ayar.)</summary>
    public bool TelemetryEnabled { get; set; }

    [Range(TelemetryConsts.MinRetentionDays, TelemetryConsts.MaxRetentionDays)]
    public int TelemetryRetentionDays { get; set; }
}
