using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 1d/9a · Kiracının takip ettiği çağrı ("Takip ettiklerim" sekmesi ve katalogdaki
/// yer imi düğmesi). Kiracıya aittir — host'un gönderdiği öneriden
/// (<see cref="GrantRecommendation"/>) ayrıdır: biri kiracının kendi işareti, diğeri
/// host'un bilinçli yönlendirmesi.
/// </summary>
public class GrantBookmark : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantCallId { get; private set; }

    protected GrantBookmark() { }

    public GrantBookmark(Guid id, Guid? tenantId, Guid grantCallId) : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
    }
}
