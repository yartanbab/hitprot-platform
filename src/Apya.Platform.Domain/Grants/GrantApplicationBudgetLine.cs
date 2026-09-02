using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2a · Başvurunun bir harcama kalemine yazdığı tutar ve gerekçesi.
/// Destek tutarı SAKLANMAZ — oran/limit programdan geldiği için
/// <see cref="GrantBudgetCalculator"/> ile hesaplanır; program parametresi
/// değiştiğinde bayat bir rakam kalmasın.
///
/// Satır yalnız programın AÇIK kalemleri için oluşur; kapalı kaleme yazılamaz
/// (uygulama katmanı doğrular, bkz. GrantApplicationWizardAppService).
/// </summary>
public class GrantApplicationBudgetLine : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }
    public GrantCostItemKind Kind { get; private set; }
    public decimal Amount { get; private set; }

    /// <summary>Kalem gerekçesi — sağ paneldeki "kalanlar" listesinde ayrı bir alan olarak sayılır.</summary>
    public string? Justification { get; private set; }

    protected GrantApplicationBudgetLine() { }

    public GrantApplicationBudgetLine(Guid id, Guid? tenantId, Guid grantApplicationId, GrantCostItemKind kind)
        : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        Kind = kind;
    }

    public void SetAmount(decimal amount)
    {
        if (amount < 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantBudgetAmountNegative);
        }
        Amount = amount;
    }

    public void SetJustification(string? justification) => Justification = justification;
}
