using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Notifications;

/// <summary>Faz 4 · Bildirim şablonları ekranının tek yükü.</summary>
public class NotificationTemplateConsoleDto
{
    public List<NotificationTemplateDto> Templates { get; set; } = new();

    public int EnabledCount { get; set; }
}

public class NotificationTemplateDto
{
    public Guid Id { get; set; }
    public NotificationType Type { get; set; }

    /// <summary>Türün hâli ("Default", "Today", "Removed"…).</summary>
    public string Variant { get; set; } = string.Empty;

    /// <summary>Ekran sekmesi (Görev, Proje, Finans).</summary>
    public NotificationCategory Category { get; set; }

    /// <summary>Bildirimin ekrandaki adı ("Görev atandı").</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Hâlin ekrandaki adı; tek hâlli türde boş.</summary>
    public string? VariantName { get; set; }

    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public List<string> Variables { get; set; } = new();
    public string PreviewSubject { get; set; } = string.Empty;
    public string PreviewBody { get; set; } = string.Empty;
}

public class SaveNotificationTemplateInput
{
    [Required(ErrorMessage = "Şablon seçilmedi.")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Başlık zorunludur.")]
    [StringLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Gövde zorunludur.")]
    [StringLength(1000, ErrorMessage = "Gövde en fazla 1000 karakter olabilir.")]
    public string Body { get; set; } = string.Empty;

    public bool IsEnabled { get; set; }
}
