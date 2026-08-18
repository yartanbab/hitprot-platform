using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Belgelere serbestçe eklenebilen etiket (tenant bazlı). Görev etiketlerinden
/// (<c>Tasks.Tag</c>) ayrı tutulur — iki modülün etiket sözlüğü karışmasın.
/// Renk kolonu yok: UI, isimden deterministik hash ile apya-chip tonlarından
/// birini seçer (Tasks.Tag ile aynı konvansiyon).
/// </summary>
public class DocumentTag : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public string Name { get; private set; } = null!;

    protected DocumentTag() { }

    public DocumentTag(Guid id, string name, Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.DocumentTagNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: DocumentConsts.MaxTagNameLength)
            .Trim().ToLowerInvariant();
    }
}
