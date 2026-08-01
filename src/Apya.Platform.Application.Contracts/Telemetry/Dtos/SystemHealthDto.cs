using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Telemetry.Dtos;

/// <summary>
/// Sistem sağlığı özeti. Sunucu tarafı metrikler ZATEN toplanan AbpAuditLogs
/// verisinden türetilir — bunun için yeni tablo yoktur.
/// </summary>
public class SystemHealthDto
{
    /// <summary>Kaç güne bakıldı — panelde başlıkta gösterilir.</summary>
    public int WindowDays { get; set; }

    /* --- İstemci (tarayıcı) tarafı --- */

    public int UnresolvedClientErrorCount { get; set; }
    public int ClientErrorOccurrencesInWindow { get; set; }

    /* --- Sunucu tarafı: AbpAuditLogs --- */

    public int ServerRequestCount { get; set; }
    public int ServerErrorCount { get; set; }
    public double ServerErrorRate { get; set; }

    public List<HealthPageStatDto> TopFailingPages { get; set; } = new();
    public List<HealthEndpointStatDto> SlowestEndpoints { get; set; } = new();
    public List<HealthTrendPointDto> ErrorTrend { get; set; } = new();
    public List<HealthTenantStatDto> ErrorsByTenant { get; set; } = new();

    /// <summary>
    /// İstemci hatalarının kaynak kırılımı (JS / Promise / AJAX). Pencereden BAĞIMSIZ
    /// değildir: son görülmesi pencere içinde kalan hatalar sayılır.
    /// </summary>
    public List<HealthSourceStatDto> ClientErrorsBySource { get; set; } = new();

    /// <summary>Tenant filtresi açılır listesi için — hata üretmemiş tenant'lar da listelenir.</summary>
    public List<HealthTenantOptionDto> TenantOptions { get; set; } = new();
}

public class HealthPageStatDto
{
    public string Url { get; set; } = string.Empty;
    public int TotalCount { get; set; }
    public int ErrorCount { get; set; }
    public double ErrorRate { get; set; }
}

public class HealthEndpointStatDto
{
    public string Url { get; set; } = string.Empty;
    public int CallCount { get; set; }
    public double AverageDurationMs { get; set; }
    public int MaxDurationMs { get; set; }
}

public class HealthTrendPointDto
{
    public DateTime Date { get; set; }
    public int ErrorCount { get; set; }
}

public class HealthTenantStatDto
{
    public Guid? TenantId { get; set; }
    public string? TenantName { get; set; }
    public int ErrorCount { get; set; }
}

/// <summary>İstemci hatalarının kaynağa göre kırılımı.</summary>
public class HealthSourceStatDto
{
    public ClientErrorSource Source { get; set; }

    /// <summary>Benzersiz hata (fingerprint) sayısı.</summary>
    public int ErrorCount { get; set; }

    /// <summary>Bu kaynaktaki hataların toplam oluşum sayısı.</summary>
    public int OccurrenceCount { get; set; }

    /// <summary>Bunlardan kaçı henüz çözülmedi.</summary>
    public int UnresolvedCount { get; set; }
}

/// <summary>Tenant filtresi seçeneği.</summary>
public class HealthTenantOptionDto
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
}

/// <summary>
/// Tek bir sunucu hatasının audit log kaydı — "En Çok Hata Veren Sayfalar"
/// satırından açılan detayda listelenir.
/// </summary>
public class ServerErrorDetailDto
{
    public DateTime ExecutionTime { get; set; }
    public int ExecutionDuration { get; set; }
    public int? HttpStatusCode { get; set; }
    public string? HttpMethod { get; set; }
    public string? UserName { get; set; }
    public string? TenantName { get; set; }
    public string? ClientIpAddress { get; set; }
    public string? BrowserInfo { get; set; }

    /// <summary>Exception metni — teşhisin asıl taşıyıcısı.</summary>
    public string? Exceptions { get; set; }
}

/// <summary>Belirli bir URL'in pencere içindeki sunucu hatalarını getirir.</summary>
public class GetServerErrorListInput
{
    [Required]
    [StringLength(2048)]
    public string Url { get; set; } = string.Empty;

    public int WindowDays { get; set; } = 7;

    /// <summary>En fazla kaç kayıt — detay listesi teşhis içindir, sayfalama gerekmez.</summary>
    public int MaxResultCount { get; set; } = 50;
}
