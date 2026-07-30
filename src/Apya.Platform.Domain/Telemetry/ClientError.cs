using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Tarayıcıda oluşan ve sunucuya raporlanan hata. Aynı hata tekrar ettiğinde yeni satır
/// açılmaz; <see cref="Fingerprint"/> üzerinden bulunup <see cref="OccurrenceCount"/>
/// artırılır — tablo tekrar eden hatayla şişmez.
/// <para>
/// Bilinçli olarak soft-delete DEĞİL (AuditedAggregateRoot): (TenantId, Fingerprint)
/// unique index'i silinmiş satırlarla çakışırdı ve saklama worker'ının kaydı gerçekten
/// silmesi gerekiyor.
/// </para>
/// </summary>
public class ClientError : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>Mesaj + stack ilk satırı + sayfa yolundan türetilen tekilleştirme imzası.</summary>
    public string Fingerprint { get; set; } = string.Empty;

    public ClientErrorSource Source { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? StackTrace { get; set; }

    /* --- Hatanın oluştuğu ortam --- */

    public string? PageUrl { get; set; }
    public string? UserAgent { get; set; }
    public string? ScreenResolution { get; set; }
    public string? AppVersion { get; set; }

    /// <summary>
    /// EN SON görülen oluşumun davranış izi (JSON dizi). Her oluşumda üzerine yazılır —
    /// geçmişin tamamı tutulmaz, teşhis için son iz yeterli.
    /// </summary>
    public string? BreadcrumbJson { get; set; }

    /* --- Etki --- */

    public int OccurrenceCount { get; set; }
    public DateTime FirstSeenAt { get; set; }
    public DateTime LastSeenAt { get; set; }

    /// <summary>Hatayı en son gören kullanıcı — tekrar edebilirlik için kime sorulacağı belli olsun.</summary>
    public Guid? LastUserId { get; set; }

    /* --- Geliştirici tarafı --- */

    public bool IsResolved { get; set; }
    public DateTime? ResolvedAt { get; set; }

    protected ClientError() { }

    public ClientError(
        Guid id,
        Guid? tenantId,
        string fingerprint,
        ClientErrorSource source,
        string message,
        DateTime now)
        : base(id)
    {
        TenantId        = tenantId;
        Fingerprint     = fingerprint;
        Source          = source;
        Message         = message;
        OccurrenceCount = 1;
        FirstSeenAt     = now;
        LastSeenAt      = now;
    }

    /// <summary>Aynı imzalı hata yeniden görüldü: sayacı artır, son bağlamı güncelle.</summary>
    public void RegisterOccurrence(DateTime now, Guid? userId, string? pageUrl, string? breadcrumbJson)
    {
        OccurrenceCount++;
        LastSeenAt = now;
        LastUserId = userId;

        if (!string.IsNullOrWhiteSpace(pageUrl))
        {
            PageUrl = pageUrl;
        }

        if (!string.IsNullOrWhiteSpace(breadcrumbJson))
        {
            BreadcrumbJson = breadcrumbJson;
        }

        // Çözüldü işaretlenmiş bir hata yeniden görüldüyse otomatik yeniden açılır.
        if (IsResolved)
        {
            IsResolved = false;
            ResolvedAt = null;
        }
    }

    public void MarkResolved(DateTime now)
    {
        IsResolved = true;
        ResolvedAt = now;
    }
}
