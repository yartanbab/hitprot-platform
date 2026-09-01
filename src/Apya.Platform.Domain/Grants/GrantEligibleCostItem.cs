using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Programın desteklediği bir harcama kalemi ve varsa üst limit yüzdesi (1b · Finansal Yapı).
/// Satırın VARLIĞI kalemin açık olduğu anlamına gelir; kapalı kalemin satırı yoktur.
/// Kiracı tarafında bütçe hesaplayıcıyı (1e) besler.
/// </summary>
public class GrantEligibleCostItem : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantId { get; private set; }
    public GrantCostItemKind Kind { get; private set; }

    /// <summary>Kalemin toplam bütçe içindeki üst limiti (%). null = limit yok.</summary>
    public int? LimitPercent { get; private set; }

    protected GrantEligibleCostItem() { }

    public GrantEligibleCostItem(Guid id, Guid grantId, GrantCostItemKind kind, int? limitPercent) : base(id)
    {
        GrantId = grantId;
        Kind = kind;
        SetLimitPercent(limitPercent);
    }

    public void SetLimitPercent(int? limitPercent)
    {
        if (limitPercent is < 0 or > 100)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantCostLimitPercentInvalid);
        }
        LimitPercent = limitPercent;
    }
}
