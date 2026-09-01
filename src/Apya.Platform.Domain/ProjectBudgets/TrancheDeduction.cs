using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Bir dilimden yapılan kesinti: "gelmedi" değil, "neden gelmedi" kaydı.
///
/// <see cref="Resolution"/> kesintinin bütçeye ne yaptığını söyler. Bu ayrım
/// tasarımın omurgası: kesinti ya bütçeyi küçültür (revizyon) ya da bütçe aynı
/// kalıp iş "finanse edilmeyen" hâle gelir. İkisi çok farklı şeyler.
///
/// Doğrudan sorgulanır (uygunluk denetimi, kesinti raporu) → kendi tenant
/// filtresini taşır.
/// </summary>
public class TrancheDeduction : FullAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid TrancheId { get; private set; }

    public decimal Amount { get; private set; }

    public string Reason { get; private set; } = null!;

    public DateTime DeductionDate { get; private set; }

    public DeductionResolution Resolution { get; private set; } = DeductionResolution.Open;

    /// <summary>
    /// <see cref="DeductionResolution.AppliedToBudget"/> ise hangi revizyonla
    /// işlendiği. Ekrandaki "Bütçeye işlendi · Rev.1" rozeti bunu okur.
    /// </summary>
    public Guid? BudgetRevisionId { get; private set; }

    /// <summary>EF Core için.</summary>
    protected TrancheDeduction()
    {
    }

    internal TrancheDeduction(Guid id, Guid? tenantId, Guid trancheId, decimal amount, string reason, DateTime deductionDate)
        : base(id)
    {
        TenantId = tenantId;
        TrancheId = trancheId;
        Amount = amount;
        SetReason(reason);
        DeductionDate = deductionDate;
    }

    public void SetReason(string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new BusinessException(PlatformDomainErrorCodes.DeductionReasonRequired);

        var clean = reason.Trim();
        Reason = clean.Length > ProjectBudgetConsts.MaxReasonLength
            ? clean[..ProjectBudgetConsts.MaxReasonLength]
            : clean;
    }

    /// <summary>Kesintiyi "finanse edilmeyen" olarak kapatır — bütçe aynı kalır.</summary>
    public void MarkUnfunded()
    {
        Resolution = DeductionResolution.Unfunded;
        BudgetRevisionId = null;
    }

    /// <summary>Kesintiyi bir bütçe revizyonuna bağlar.</summary>
    public void MarkAppliedToBudget(Guid budgetRevisionId)
    {
        Resolution = DeductionResolution.AppliedToBudget;
        BudgetRevisionId = budgetRevisionId;
    }

    /// <summary>Kararı geri alır — kesinti yeniden "açık" olur.</summary>
    public void Reopen()
    {
        Resolution = DeductionResolution.Open;
        BudgetRevisionId = null;
    }
}
