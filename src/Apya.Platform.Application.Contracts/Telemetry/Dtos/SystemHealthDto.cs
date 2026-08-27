using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Telemetry.Dtos;

/// <summary>
/// Sistem sağlığı özeti. Sunucu tarafı metrikler ZATEN toplanan AbpAuditLogs
/// verisinden türetilir — bunun için yeni tablo yoktur.
/// <para>
/// Toplama SQL'de yapılır (GROUP BY), bu yüzden sayılar <b>pencerenin tamamını</b>
/// yansıtır. Eskiden en yeni 200.000 satır belleğe çekilip orada gruplanıyordu ve
/// aşan kısım sessizce dışarıda kalıyordu.
/// </para>
/// </summary>
public class SystemHealthDto
{
    /// <summary>Kaç güne bakıldı — panelde başlıkta gösterilir.</summary>
    public int WindowDays { get; set; }

    /// <summary>Bir çağrının yavaş sayıldığı süre (ms) — panel ölçütü açıkça yazsın diye taşınır.</summary>
    public int SlowThresholdMs { get; set; }

    /// <summary>Yavaş uç listesine girmek için gereken en az çağrı sayısı.</summary>
    public int EndpointMinCallCount { get; set; }

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
    /// <summary>Normalize edilmiş uç yolu — <see cref="HealthEndpointStatDto.Url"/> ile aynı kimlik.</summary>
    public string Url { get; set; } = string.Empty;

    public string? HttpMethod { get; set; }

    public int TotalCount { get; set; }
    public int ErrorCount { get; set; }
    public double ErrorRate { get; set; }
}

/// <summary>
/// Bir ucun pencere içindeki davranışı. Uç kimliği <b>HTTP metodu + normalize yol</b>:
/// <c>GET /api/app/task</c> ile <c>POST /api/app/task</c> ayrı uçlardır ve yoldaki
/// kayda özgü kimlikler <c>{id}</c> ile değiştirilmiştir (bkz. EndpointUrlNormalizer).
/// </summary>
public class HealthEndpointStatDto
{
    /// <summary>Normalize edilmiş yol — ör. <c>/Projects/ProjectDetails/{id}</c>.</summary>
    public string Url { get; set; } = string.Empty;

    public string? HttpMethod { get; set; }

    public int CallCount { get; set; }
    public double AverageDurationMs { get; set; }
    public int MaxDurationMs { get; set; }

    /// <summary>Bu uçtaki hatalı istek sayısı (exception yazılmış ya da 5xx dönmüş).</summary>
    public int ErrorCount { get; set; }

    public double ErrorRate { get; set; }

    /// <summary>
    /// Yavaşlık eşiğini aşan çağrı sayısı. Ortalama tek bir uç değerle bozulur;
    /// "kaç çağrı fiilen yavaştı" sorusunun cevabı bu alandır.
    /// </summary>
    public int SlowCallCount { get; set; }
}

public class HealthTrendPointDto
{
    public DateTime Date { get; set; }
    public int ErrorCount { get; set; }
}

/// <summary>
/// Kiracının pencere içindeki sağlığı. Yalnız hata SAYISI yanıltıcıdır — 10 istekte
/// 3 hata ile 100.000 istekte 3 hata aynı değildir; hacim ve oran birlikte taşınır.
/// </summary>
public class HealthTenantStatDto
{
    public Guid? TenantId { get; set; }
    public string? TenantName { get; set; }

    /// <summary>Pencere içindeki toplam sunucu isteği.</summary>
    public int RequestCount { get; set; }

    public int ErrorCount { get; set; }
    public double ErrorRate { get; set; }

    public double AverageDurationMs { get; set; }

    /// <summary>Yavaşlık eşiğini aşan çağrı sayısı.</summary>
    public int SlowCallCount { get; set; }

    /// <summary>Son görülmesi pencere içinde kalan benzersiz istemci hatası sayısı.</summary>
    public int ClientErrorCount { get; set; }

    /// <summary>Bunlardan kaçı henüz çözülmedi.</summary>
    public int UnresolvedClientErrorCount { get; set; }
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
    /// <summary>
    /// İsteğin HAM adresi — normalize uç yolu değil. Aynı uçta hangi somut kaydın
    /// patladığını gösterir (<c>/Projects/ProjectDetails/{id}</c> yerine gerçek Id).
    /// </summary>
    public string? Url { get; set; }

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

/// <summary>Belirli bir ucun pencere içindeki sunucu hatalarını getirir.</summary>
public class GetServerErrorListInput
{
    /// <summary>
    /// <b>Normalize</b> uç yolu (<c>/Projects/ProjectDetails/{id}</c>) — panelin
    /// gösterdiği değerin aynısı. Ham adres beklenmiyor.
    /// </summary>
    [Required]
    [StringLength(2048)]
    public string Url { get; set; } = string.Empty;

    /// <summary>Uç kimliğinin ikinci yarısı. Boşsa metot ayrımı yapılmaz.</summary>
    [StringLength(16)]
    public string? HttpMethod { get; set; }

    public int WindowDays { get; set; } = 7;

    /// <summary>En fazla kaç kayıt — detay listesi teşhis içindir, sayfalama gerekmez.</summary>
    public int MaxResultCount { get; set; } = 50;
}
