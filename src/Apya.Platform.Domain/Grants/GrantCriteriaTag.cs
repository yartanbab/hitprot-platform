using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Bir programın eşleştirme kriteri (sektör/bölge/anahtar kelime). Grant'ın child'ı.
/// Faz B'de FirmProfile'daki aynı türdeki etiketlerle örtüşme skoru hesaplanır.
/// </summary>
public class GrantCriteriaTag : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantId { get; private set; }
    public GrantCriteriaKind Kind { get; private set; }
    public string Value { get; private set; } = null!;

    protected GrantCriteriaTag() { }

    public GrantCriteriaTag(Guid id, Guid grantId, GrantCriteriaKind kind, string value) : base(id)
    {
        GrantId = grantId;
        Kind = kind;
        Value = Check.NotNullOrWhiteSpace(value, nameof(value), maxLength: 64).Trim();
    }
}
