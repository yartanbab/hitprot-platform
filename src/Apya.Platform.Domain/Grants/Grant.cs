using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

public class Grant : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; set; }

    public string Issuer { get; set; }

    public string Description { get; set; }

    public decimal? MaxAmount { get; set; } // Tutar alanı

    public double MinMatchScore { get; set; }

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