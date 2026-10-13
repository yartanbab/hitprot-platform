using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Notifications;

/// <summary>İstemcinin abone olmak için ihtiyaç duyduğu bilgi. Özel anahtar ASLA dönmez.</summary>
public class WebPushConfigDto
{
    public bool Enabled { get; set; }
    public string? PublicKey { get; set; }
}

public class NotificationDeviceDto : EntityDto<Guid>
{
    public NotificationDevicePlatform Platform { get; set; }
    public string? DeviceLabel { get; set; }
    public bool IsActive { get; set; }
    public DateTime? LastSeenAt { get; set; }
    public DateTime CreationTime { get; set; }

    /// <summary>
    /// Abonelik adresinin SHA-256 özeti. İstemci kendi aboneliğinin özetiyle karşılaştırıp
    /// "bu cihaz" satırını işaretler; adresin kendisi (bildirim göndermeye yeten sır) dönmez.
    /// </summary>
    public string EndpointHash { get; set; } = string.Empty;
}

/// <summary>Tarayıcının <c>PushSubscription</c> nesnesinden gelen alanlar.</summary>
public class RegisterWebPushInput
{
    [Required(ErrorMessage = "Abonelik adresi zorunludur.")]
    [StringLength(NotificationDeviceConsts.MaxEndpointLength, ErrorMessage = "Abonelik adresi çok uzun.")]
    public string Endpoint { get; set; } = string.Empty;

    [Required(ErrorMessage = "Abonelik anahtarı zorunludur.")]
    [StringLength(NotificationDeviceConsts.MaxKeyLength, ErrorMessage = "Abonelik anahtarı çok uzun.")]
    public string P256dh { get; set; } = string.Empty;

    [Required(ErrorMessage = "Abonelik anahtarı zorunludur.")]
    [StringLength(NotificationDeviceConsts.MaxKeyLength, ErrorMessage = "Abonelik anahtarı çok uzun.")]
    public string Auth { get; set; } = string.Empty;

    [StringLength(NotificationDeviceConsts.MaxUserAgentLength * 2)]
    public string? UserAgent { get; set; }
}

public class UnsubscribeWebPushInput
{
    [Required(ErrorMessage = "Abonelik adresi zorunludur.")]
    [StringLength(NotificationDeviceConsts.MaxEndpointLength, ErrorMessage = "Abonelik adresi çok uzun.")]
    public string Endpoint { get; set; } = string.Empty;
}
