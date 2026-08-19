using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kuralın tek koşulu. Alan KAPALI LİSTEDEN secilir (serbest JSON yolu degil):
/// yanlis yazilmis bir yol, hicbir zaman eslesmeyen ve bunu belli etmeyen
/// bir kural uretirdi.
/// </summary>
public class DocumentRuleCondition : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid RuleId { get; private set; }

    public int Order { get; private set; }

    public DocumentRuleField Field { get; private set; }

    public DocumentRuleOperator Operator { get; private set; }

    /// <summary>Karsilastirma degeri. IsEmpty/IsNotEmpty icin bos kalir.</summary>
    public string? CompareValue { get; private set; }

    protected DocumentRuleCondition() { }

    public DocumentRuleCondition(
        Guid id,
        Guid? tenantId,
        Guid ruleId,
        int order,
        DocumentRuleField field,
        DocumentRuleOperator ruleOperator,
        string? compareValue) : base(id)
    {
        TenantId = tenantId;
        RuleId = ruleId;
        Order = order;
        Field = field;
        Operator = ruleOperator;
        SetCompareValue(compareValue);
    }

    public void SetCompareValue(string? value)
        => CompareValue = string.IsNullOrWhiteSpace(value)
            ? null
            : Check.Length(value.Trim(), nameof(value), RuleConsts.MaxCompareValueLength);
}
