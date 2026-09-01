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

    // --- 1b · uygunluk şartlarının firma tarafındaki karşılıkları ---
    // Grant'taki her eleyici şartın burada bir aynası vardır; biri olmadan diğeri
    // değerlendirilemez. Hepsi nullable: null = "firma bu veriyi girmemiş" → kural
    // Unknown döner, firma ELENMEZ ama "eksik veri" sayacına girer (1b sağ panel).
    public DateTime? FoundedOn { get; set; }
    public int? StaffCount { get; set; }
    public int? RdStaffCount { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public int? Trl { get; set; }
    public bool? HasConsortiumPartner { get; set; }

    public ICollection<FirmProfileTag> Tags { get; set; } = new List<FirmProfileTag>();

    protected FirmProfile() { }

    public FirmProfile(Guid id, Guid? tenantId) : base(id)
    {
        TenantId = tenantId;
    }
}
