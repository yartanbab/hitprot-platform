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

    /// <summary>Resmî çağrı metninin adresi (1b başlığında ve kaynak karşılaştırmada gösterilir).</summary>
    public string? SourceUrl { get; set; }

    // Faz A: eşleştirme kriterleri (Faz B'de FirmProfile ile örtüşme skoru).
    public int EligibleCompanySizes { get; set; } // CompanySize bit-maskesi (0 = kısıt yok)

    // --- 1b · Uygunluk Şartları ---
    // Hepsi nullable: null = "bu programda böyle bir şart YOK", 0 değil. Firma tarafındaki
    // karşılığı boşsa kural Unknown döner ve firmayı ELEMEZ (bkz. GrantMatchManager.Evaluate).
    public int? MinCompanyAgeYears { get; set; }
    public int? MaxCompanyAgeYears { get; set; }
    public int? MinTrl { get; set; }
    public int? MaxTrl { get; set; }
    public int? MinStaffCount { get; set; }
    public int? MinRdStaffCount { get; set; }
    public decimal? MinRevenue { get; set; }
    public decimal? MaxRevenue { get; set; }
    public bool RequiresConsortium { get; set; }
    public int? MinConsortiumPartners { get; set; }

    // Öncelik puanı içindir, ELEYİCİ DEĞİLDİR — uygunluk değerlendirmesine girmez.
    public bool PrefersFemaleEntrepreneur { get; set; }
    public bool PrefersYoungEntrepreneur { get; set; }

    // --- 1b · Finansal Yapı ---
    // Eş finansman oranı SAKLANMAZ: 100 - SupportRatePercent olarak türetilir.
    public int? SupportRatePercent { get; set; }
    public int? ProjectDurationMonths { get; set; }
    public GrantRepaymentType RepaymentType { get; set; }
    public bool HasAdvancePayment { get; set; }
    public bool RequiresGuaranteeLetter { get; set; }

    // --- 1b · Süreç Şablonu ---
    /// <summary>Programın kullandığı aşama şablonu (3b). null = şablon seçilmemiş.</summary>
    public Guid? StageTemplateId { get; set; }

    public ICollection<GrantCall> Calls { get; set; } = new List<GrantCall>();
    public ICollection<GrantCriteriaTag> CriteriaTags { get; set; } = new List<GrantCriteriaTag>();
    public ICollection<GrantEligibleCostItem> EligibleCostItems { get; set; } = new List<GrantEligibleCostItem>();
    public ICollection<GrantDocumentRequirement> DocumentRequirements { get; set; } = new List<GrantDocumentRequirement>();

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
