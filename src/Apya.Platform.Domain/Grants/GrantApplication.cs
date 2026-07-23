using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Firma başvurusu (minimal, Faz B1). Faz C zenginleştirir: ApprovedAmount + tahsilat
/// dilimleri + milestone/son tarihler + pipeline aşama ilerletme.
/// </summary>
public class GrantApplication : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantCallId { get; private set; }
    public GrantApplicationStage Stage { get; set; }
    public DateTime AppliedDate { get; private set; }

    protected GrantApplication() { }

    public GrantApplication(Guid id, Guid? tenantId, Guid grantCallId) : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        Stage = GrantApplicationStage.Basvuru;
        AppliedDate = DateTime.Now;
    }
}
