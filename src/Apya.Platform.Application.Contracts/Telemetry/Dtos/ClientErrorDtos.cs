using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Telemetry.Dtos;

/// <summary>İstemcinin hata anında gönderdiği rapor.</summary>
public class ReportClientErrorDto
{
    [Required]
    public ClientErrorSource Source { get; set; }

    [Required]
    [StringLength(ClientErrorConsts.MaxMessageLength)]
    public string Message { get; set; } = string.Empty;

    [StringLength(ClientErrorConsts.MaxStackTraceLength)]
    public string? StackTrace { get; set; }

    [StringLength(ClientErrorConsts.MaxPageUrlLength)]
    public string? PageUrl { get; set; }

    [StringLength(ClientErrorConsts.MaxScreenSizeLength)]
    public string? ScreenResolution { get; set; }

    [StringLength(ClientErrorConsts.MaxAppVersionLength)]
    public string? AppVersion { get; set; }

    /// <summary>Hatadan hemen önceki davranış izi. Form alanı değerleri içermez.</summary>
    [StringLength(ClientErrorConsts.MaxBreadcrumbLength)]
    public string? BreadcrumbJson { get; set; }

    /// <summary>İstemciden (navigator.userAgent) gelir — yalnızca teşhis amaçlı.</summary>
    [StringLength(ClientErrorConsts.MaxUserAgentLength)]
    public string? UserAgent { get; set; }
}

public class ClientErrorDto : EntityDto<Guid>
{
    public string Fingerprint { get; set; } = string.Empty;
    public ClientErrorSource Source { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? StackTrace { get; set; }

    public string? PageUrl { get; set; }
    public string? UserAgent { get; set; }
    public string? ScreenResolution { get; set; }
    public string? AppVersion { get; set; }
    public string? BreadcrumbJson { get; set; }

    public int OccurrenceCount { get; set; }
    public DateTime FirstSeenAt { get; set; }
    public DateTime LastSeenAt { get; set; }
    public Guid? LastUserId { get; set; }

    public bool IsResolved { get; set; }
    public DateTime? ResolvedAt { get; set; }

    public Guid? TenantId { get; set; }
    public string? TenantName { get; set; }
}

public class GetClientErrorListInput : PagedAndSortedResultRequestDto
{
    public bool? IsResolved { get; set; }
    public ClientErrorSource? Source { get; set; }
    public Guid? TenantId { get; set; }

    /// <summary>Hata mesajı veya sayfa yolunda geçen metin.</summary>
    public string? Filter { get; set; }
}
