using System;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Göreve dönüştürülecek sunucu hatasının özeti. Kaynağı AbpAuditLogs olduğu için
/// kalıcı bir entity yoktur — çağıran (uygulama katmanı) audit log satırlarından
/// derleyip geçer, teşhis metni göreve KOPYALANIR.
/// </summary>
public class ServerErrorSignal
{
    public string Url { get; set; } = string.Empty;

    /// <summary>Exception metni — teşhisin asıl taşıyıcısı.</summary>
    public string? ExceptionText { get; set; }

    /// <summary>Exception'ın tür adı; tekilleştirme anahtarına girer.</summary>
    public string? ExceptionType { get; set; }

    public string? HttpMethod { get; set; }
    public int? HttpStatusCode { get; set; }

    /// <summary>Pencere içinde kaç kez oluştu.</summary>
    public int OccurrenceCount { get; set; }

    public DateTime FirstSeenAt { get; set; }
    public DateTime LastSeenAt { get; set; }

    /// <summary>Hatanın görüldüğü tenant — birden fazlaysa en çok etkilenen.</summary>
    public Guid? TenantId { get; set; }

    public string? TenantName { get; set; }
}
