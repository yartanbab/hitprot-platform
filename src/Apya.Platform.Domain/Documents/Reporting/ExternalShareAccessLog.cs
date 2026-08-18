using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Süreli linkin erişim kaydı — "denetçi ne zaman baktı, indirdi mi".
///
/// KVKK: ham IP tutulmaz. <see cref="IpHash"/> tek yönlü özettir; amaç kişiyi
/// tanımlamak değil, aynı ziyaretçiyi tekrar eden erişimlerde eşleştirebilmek ve
/// kötüye kullanımı fark etmek. Kayıt append-only'dir.
/// </summary>
public class ExternalShareAccessLog : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid ShareLinkId { get; set; }

    /// <summary>true = dosya indirdi, false = yalnız görüntüledi.</summary>
    public bool IsDownload { get; set; }

    public string? IpHash { get; set; }

    public string? UserAgent { get; set; }

    public ExternalShareAccessLog() { }

    public ExternalShareAccessLog(
        Guid id, Guid? tenantId, Guid shareLinkId, bool isDownload, string? ipHash, string? userAgent)
        : base(id)
    {
        TenantId = tenantId;
        ShareLinkId = shareLinkId;
        IsDownload = isDownload;
        IpHash = ipHash;
        UserAgent = userAgent;
    }
}
