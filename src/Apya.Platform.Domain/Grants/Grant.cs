using System;
using System.Collections.Generic;
using Volo.Abp;
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

    /// <summary>Asgari destek tutarı. null = alt limit yok (MaxAmount'un aksine kolon nullable).</summary>
    public decimal? MinAmount { get; set; }

    public double MinMatchScore { get; set; }

    /// <summary>Resmî çağrı metninin adresi (1b başlığında ve kaynak karşılaştırmada gösterilir).</summary>
    public string? SourceUrl { get; set; }

    // --- Kimlik · resmî duyurunun metin başlıkları ---
    // Eşleştirmeye GİRMEZ; kiracı detayında okunur. Öncelikler ve uygun başvuru sahipleri
    // satır başına bir madde olarak yazılır, istemci satırları listeye çevirir.
    public string? Objective { get; set; }
    public string? Priorities { get; set; }
    public string? EligibleApplicants { get; set; }

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

    // --- 12b · Program afişi ---
    /// <summary>
    /// Afişin App_Data/uploads altındaki saklanan adı. null = afiş yok; kiracı kartı kuruma
    /// özel iki tonlu zemin çizer. Proje kapağıyla aynı sözleşme: dosyayı diske yazmak ve
    /// eskisini silmek Web katmanının işidir, burada yalnız ad tutulur.
    /// </summary>
    public string? PosterFileName { get; private set; }

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

    /// <summary>
    /// Aralık şartlarında en az değer en fazla değeri geçemez. Ters aralık eşleştirmede her firma için
    /// "karşılamıyor" sayılır ve programı sessizce herkese kapatır; kayıt anında reddedilir.
    /// <see cref="MaxAmount"/> 0 ise "üst limit yok" demektir (katalog sözleşmesi) ve karşılaştırılmaz.
    /// </summary>
    public void EnsureRangesValid() => EnsureRangesValid(
        MinCompanyAgeYears, MaxCompanyAgeYears, MinTrl, MaxTrl, MinRevenue, MaxRevenue, MinAmount, MaxAmount);

    /// <summary>
    /// Aynı kural, entity'ye YAZMADAN önce girdi üzerinde. 🔴 Önce doğrula, sonra değiştir: izlenen entity
    /// değiştirildikten sonra atılan istisna, işlemsiz bir UoW'da (test ortamı) denetim önleyicisinin
    /// SaveChanges'ı ile yine de kalıcı olabiliyor.
    /// </summary>
    public static void EnsureRangesValid(
        int? minCompanyAgeYears, int? maxCompanyAgeYears,
        int? minTrl, int? maxTrl,
        decimal? minRevenue, decimal? maxRevenue,
        decimal? minAmount, decimal? maxAmount)
    {
        if (minCompanyAgeYears > maxCompanyAgeYears)
            throw new BusinessException(PlatformDomainErrorCodes.GrantRangeCompanyAgeInverted);
        if (minTrl > maxTrl)
            throw new BusinessException(PlatformDomainErrorCodes.GrantRangeTrlInverted);
        if (minRevenue > maxRevenue)
            throw new BusinessException(PlatformDomainErrorCodes.GrantRangeRevenueInverted);
        if (maxAmount is > 0 && minAmount > maxAmount)
            throw new BusinessException(PlatformDomainErrorCodes.GrantRangeAmountInverted);
    }

    /// <summary>12b · Boş ad afişi kaldırır.</summary>
    public void SetPoster(string? storedFileName)
    {
        PosterFileName = string.IsNullOrWhiteSpace(storedFileName) ? null : storedFileName.Trim();
    }
}
