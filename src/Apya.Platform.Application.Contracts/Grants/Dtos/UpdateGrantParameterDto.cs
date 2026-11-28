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

    /// <summary>Program logosunun adresi. Parametre formu bu alanı göstermez, okuduğunu aynen geri gönderir.</summary>
    [StringLength(512, ErrorMessage = "Logo adresi en fazla {1} karakter olabilir.")]
    public string? LogoUrl { get; set; }

    [StringLength(2000, ErrorMessage = "Programın amacı en fazla {1} karakter olabilir.")]
    public string? Objective { get; set; }

    [StringLength(4000, ErrorMessage = "Programın öncelikleri en fazla {1} karakter olabilir.")]
    public string? Priorities { get; set; }

    [StringLength(2000, ErrorMessage = "Uygun başvuru sahipleri en fazla {1} karakter olabilir.")]
    public string? EligibleApplicants { get; set; }

    // --- Uygunluk Şartları ---
    public int EligibleCompanySizes { get; set; }
    /// <summary>Başvurabilecek kurum türleri — OrganizationType bit maskesi (0 = kısıt yok).</summary>
    public int EligibleApplicantTypes { get; set; }
    /// <summary>Platform kurumlarına kapalı (yalnız birey/okul/kamu başvurur).</summary>
    public bool ClosedToPlatformApplicants { get; set; }
    /// <summary>Platformda hesabı olmayan başvuru sahipleri — ExternalApplicantType bit maskesi. Eşleştirmeye girmez.</summary>
    public int ExternalApplicantTypes { get; set; }
    public GrantTurkeyParticipation TurkeyParticipation { get; set; }
    public GrantGeographicScope GeographicScope { get; set; }
    public GrantCallCycle CallCycle { get; set; }

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
    public decimal? MinAmount { get; set; }

    [Range(0, 999999999999.99, ErrorMessage = "Destek tutarı negatif olamaz.")]
    public decimal? MaxAmount { get; set; }

    /// <summary>Tutarların para birimi; boş gelirse TRY. Desteklenmeyen kod reddedilir.</summary>
    [RegularExpression("^(TRY|EUR|USD|GBP|CHF|JPY|SEK|NOK|CAD|AUD|CZK)$", ErrorMessage = "Para birimi listedeki kodlardan biri olmalı (TRY, EUR, USD, GBP, CHF, JPY, SEK, NOK, CAD, AUD, CZK).")]
    public string? Currency { get; set; }

    [Range(0, 100, ErrorMessage = "Destek oranı 0 ile 100 arasında olmalıdır.")]
    public int? SupportRatePercent { get; set; }

    [Range(1, 240, ErrorMessage = "Proje süresi 1 ile 240 ay arasında olmalıdır.")]
    public int? ProjectDurationMonths { get; set; }

    public GrantRepaymentType RepaymentType { get; set; }
    public GrantSupportType SupportType { get; set; }
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
