using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kuralin uyguladigi tek eylem.
///
/// Eylem kumesi bilincli olarak GERI ALINABILIR islemlerle sinirli: silme,
/// disa gonderme veya paylasim yok. Kural motorunun sessizce yikici bir sey
/// yapmasi kabul edilemez.
/// </summary>
public class DocumentRuleAction : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid RuleId { get; private set; }

    public int Order { get; private set; }

    public DocumentRuleActionType ActionType { get; private set; }

    /// <summary>Hedef deger: klasor/tip/is adimi icin Guid, etiket/donem icin metin.</summary>
    public string? Payload { get; private set; }

    protected DocumentRuleAction() { }

    public DocumentRuleAction(
        Guid id,
        Guid? tenantId,
        Guid ruleId,
        int order,
        DocumentRuleActionType actionType,
        string? payload) : base(id)
    {
        TenantId = tenantId;
        RuleId = ruleId;
        Order = order;
        ActionType = actionType;
        SetPayload(payload);
    }

    public void SetPayload(string? payload)
        => Payload = string.IsNullOrWhiteSpace(payload)
            ? null
            : Check.Length(payload.Trim(), nameof(payload), RuleConsts.MaxActionPayloadLength);
}
