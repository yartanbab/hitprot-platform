using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görevlere serbestçe eklenebilen etiket (tenant bazlı). Renk atanmaz — UI, isimden
/// deterministik hash ile mevcut apya-chip tonlarından birini seçer.
/// </summary>
public class Tag : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }
    public string Name { get; private set; } = null!;

    protected Tag() { }

    public Tag(Guid id, string name, Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 64).Trim();
    }
}
