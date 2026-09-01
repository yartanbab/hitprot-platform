using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Kalıcı öneri kaydı — yalnız host-push (Faz B3) için. Otomatik feed (tenant-pull)
/// canlı hesaplanır, kalıcılık yok; bu entity yalnız host'un bilinçli gönderdiği önerileri tutar.
/// </summary>
public class GrantRecommendation : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantCallId { get; private set; }
    public GrantRecommendationSource Source { get; private set; }
    public string? Note { get; private set; }
    public GrantRecommendationStatus Status { get; private set; }

    /// <summary>
    /// 1c · Bu öneriyi yürütecek danışman (host kullanıcısı). null = atanmamış.
    /// Danışmanlık kapasitesinin hangi işlere gittiğini görünür kılar.
    /// </summary>
    public Guid? AssignedUserId { get; set; }

    protected GrantRecommendation() { }

    public GrantRecommendation(Guid id, Guid? tenantId, Guid grantCallId, GrantRecommendationSource source, string? note) : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        Source = source;
        Note = note?.Trim().Truncate(256);
        Status = GrantRecommendationStatus.New;
    }

    public void MarkApplied()
    {
        if (Status != GrantRecommendationStatus.Dismissed)
        {
            Status = GrantRecommendationStatus.Applied;
        }
    }
}
