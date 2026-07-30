using System;
using System.Collections.Generic;

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
