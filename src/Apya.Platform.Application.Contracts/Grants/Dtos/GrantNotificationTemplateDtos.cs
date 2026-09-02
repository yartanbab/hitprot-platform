using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>6d · Bildirim şablonları konsolunun tek yükü.</summary>
public class GrantNotificationConsoleDto
{
    public List<GrantNotificationTemplateDto> Templates { get; set; } = new();

    /// <summary>Açık şablon sayısı — başlıktaki "N aktif" rozeti.</summary>
    public int EnabledCount { get; set; }
}

public class GrantNotificationTemplateDto
{
    public Guid Id { get; set; }
    public GrantNotificationTrigger Trigger { get; set; }
    public bool IsEnabled { get; set; }
    public bool InApp { get; set; }
    public bool Email { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;

    /// <summary>Kullanıcı susturamaz; ekran kanal ve durum anahtarlarını kilitler.</summary>
    public bool IsMandatory { get; set; }

    /// <summary>Bu tetikleyicide doldurulabilen değişkenler.</summary>
    public List<string> Variables { get; set; } = new();

    /// <summary>Örnek değerlerle doldurulmuş başlık — önizleme panelinde gösterilir.</summary>
    public string PreviewSubject { get; set; } = string.Empty;

    /// <summary>Örnek değerlerle doldurulmuş gövde.</summary>
    public string PreviewBody { get; set; } = string.Empty;
}

public class SaveGrantNotificationTemplateInput
{
    [Required(ErrorMessage = "Şablon seçilmedi.")]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Başlık zorunludur.")]
    [StringLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Gövde zorunludur.")]
    [StringLength(2000, ErrorMessage = "Gövde en fazla 2000 karakter olabilir.")]
    public string Body { get; set; } = string.Empty;

    public bool IsEnabled { get; set; }
    public bool InApp { get; set; }
    public bool Email { get; set; }
}
