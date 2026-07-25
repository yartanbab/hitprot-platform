using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Firma başvurusu. Faz C: ApprovedAmount + pipeline aşama ilerletme eklendi (host ilerletir,
/// bkz <see cref="AdvanceStage"/>). Tahsilat dilimleri (<see cref="GrantDisbursementTranche"/>)
/// ve milestone'lar (<see cref="GrantMilestone"/>) ayrı child entity'lerdir.
/// </summary>
public class GrantApplication : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantCallId { get; private set; }
    public GrantApplicationStage Stage { get; private set; }
    public DateTime AppliedDate { get; private set; }
    public decimal? ApprovedAmount { get; private set; }

    protected GrantApplication() { }

    public GrantApplication(Guid id, Guid? tenantId, Guid grantCallId) : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        Stage = GrantApplicationStage.Basvuru;
        AppliedDate = DateTime.Now;
    }

    /// <summary>Aşamayı ilerletir (host). <paramref name="approvedAmount"/> verilmezse mevcut değer korunur.</summary>
    public void AdvanceStage(GrantApplicationStage stage, decimal? approvedAmount = null)
    {
        Stage = stage;
        if (approvedAmount.HasValue)
        {
            ApprovedAmount = approvedAmount;
        }
    }
}
