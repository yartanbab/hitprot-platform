using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>Firma profilinin eşleştirme etiketi (GrantCriteriaTag ile aynı desen).</summary>
public class FirmProfileTag : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid FirmProfileId { get; private set; }
    public GrantCriteriaKind Kind { get; private set; }
    public string Value { get; private set; } = null!;

    protected FirmProfileTag() { }

    public FirmProfileTag(Guid id, Guid firmProfileId, GrantCriteriaKind kind, string value) : base(id)
    {
        FirmProfileId = firmProfileId;
        Kind = kind;
        Value = Check.NotNullOrWhiteSpace(value, nameof(value), maxLength: 64).Trim();
    }
}
