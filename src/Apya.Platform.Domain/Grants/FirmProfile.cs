using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Firma (tenant) eşleştirme profili — tenant başına tekil. Elle girilen sinyaller
/// (ölçek + sektör/bölge/anahtar kelime). Faz B2: proje verisiyle zenginleştirme.
/// </summary>
public class FirmProfile : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public CompanySize? Size { get; set; }
    public ICollection<FirmProfileTag> Tags { get; set; } = new List<FirmProfileTag>();

    protected FirmProfile() { }

    public FirmProfile(Guid id, Guid? tenantId) : base(id)
    {
        TenantId = tenantId;
    }
}
