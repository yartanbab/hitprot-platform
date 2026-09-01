using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 1b · parametre formunun yazma modeli. Türetilmiş alanlar (eş finansman) ve durum
/// göstergeleri buraya GİRMEZ — sunucuda hesaplanır.
/// Hata metinleri bilerek açıkça yazıldı: DataAnnotations, ErrorMessage boş bırakılırsa
/// localizer'ı hiç kullanmaz ve mesaj İngilizce döner.
/// </summary>
public class UpdateGrantParameterDto
{
    [Required(ErrorMessage = "Program adı zorunludur.")]
    [StringLength(128, ErrorMessage = "Program adı en fazla {1} karakter olabilir.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kurum zorunludur.")]
    [StringLength(64, ErrorMessage = "Kurum adı en fazla {1} karakter olabilir.")]
    public string Issuer { get; set; } = string.Empty;

    public string? Description { get; set; }

    [StringLength(512, ErrorMessage = "Kaynak adresi en fazla {1} karakter olabilir.")]
    public string? SourceUrl { get; set; }

    // --- Uygunluk Şartları ---
    public int EligibleCompanySizes { get; set; }

    [Range(0, 200, ErrorMessage = "Şirket yaşı 0 ile 200 arasında olmalıdır.")]
    public int? MinCompanyAgeYears { get; set; }

    [Range(0, 200, ErrorMessage = "Şirket yaşı 0 ile 200 arasında olmalıdır.")]
    public int? MaxCompanyAgeYears { get; set; }

    [Range(1, 9, ErrorMessage = "TRL değeri 1 ile 9 arasında olmalıdır.")]
    public int? MinTrl { get; set; }

    [Range(1, 9, ErrorMessage = "TRL değeri 1 ile 9 arasında olmalıdır.")]
    public int? MaxTrl { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Personel sayısı negatif olamaz.")]
    public int? MinStaffCount { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Personel sayısı negatif olamaz.")]
    public int? MinRdStaffCount { get; set; }

    [Range(0, 999999999999.99, ErrorMessage = "Ciro negatif olamaz.")]
    public decimal? MinRevenue { get; set; }

    [Range(0, 999999999999.99, ErrorMessage = "Ciro negatif olamaz.")]
    public decimal? MaxRevenue { get; set; }

    public bool RequiresConsortium { get; set; }

    [Range(2, 99, ErrorMessage = "Konsorsiyum en az 2 ortak gerektirir.")]
    public int? MinConsortiumPartners { get; set; }

    public bool PrefersFemaleEntrepreneur { get; set; }
    public bool PrefersYoungEntrepreneur { get; set; }

    public List<GrantCriteriaTagDto> CriteriaTags { get; set; } = new();

    // --- Finansal Yapı ---
    [Range(0, 999999999999.99, ErrorMessage = "Destek tutarı negatif olamaz.")]
    public decimal? MaxAmount { get; set; }

    [Range(0, 100, ErrorMessage = "Destek oranı 0 ile 100 arasında olmalıdır.")]
    public int? SupportRatePercent { get; set; }

    [Range(1, 240, ErrorMessage = "Proje süresi 1 ile 240 ay arasında olmalıdır.")]
    public int? ProjectDurationMonths { get; set; }

    public GrantRepaymentType RepaymentType { get; set; }
    public bool HasAdvancePayment { get; set; }
    public bool RequiresGuaranteeLetter { get; set; }

    public List<GrantEligibleCostItemDto> EligibleCostItems { get; set; } = new();

    // --- Evrak & Belgeler ---
    public List<GrantDocumentRequirementDto> DocumentRequirements { get; set; } = new();

    // --- Süreç Şablonu ---
    public Guid? StageTemplateId { get; set; }

    // --- Eşleştirme eşiği ---
    [Range(0, 100, ErrorMessage = "Uyum eşiği 0 ile 100 arasında olmalıdır.")]
    public double MinMatchScore { get; set; }
}
