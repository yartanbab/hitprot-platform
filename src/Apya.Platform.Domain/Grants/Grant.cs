using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

public class Grant : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; set; } = null!;

    public string Issuer { get; set; } = null!;

    public string Description { get; set; } = null!;

    public decimal? MaxAmount { get; set; } // Tutar alanı

    public double MinMatchScore { get; set; }

    // Faz A: eşleştirme kriterleri (Faz B'de FirmProfile ile örtüşme skoru).
    public int EligibleCompanySizes { get; set; } // CompanySize bit-maskesi (0 = kısıt yok)
    public ICollection<GrantCall> Calls { get; set; } = new List<GrantCall>();
    public ICollection<GrantCriteriaTag> CriteriaTags { get; set; } = new List<GrantCriteriaTag>();

    public Grant()
    {
    }

    // GÜNCELLENEN CONSTRUCTOR:
    // 4. sıraya 'decimal maxAmount' koyduk ki hata düzelisn.
    public Grant(Guid id, string name, string issuer, decimal maxAmount, double minMatchScore)
        : base(id)
    {
        Name = name;
        Issuer = issuer;
        MaxAmount = maxAmount; // Gelen sayıyı buraya atıyoruz
        MinMatchScore = minMatchScore;
        Description = ""; // Açıklama boş kalsın şimdilik
    }
}