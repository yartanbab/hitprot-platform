using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 1b · Hibe Parametre Formu'nun okuma modeli. Programın tüm parametreleri + formun
/// durum göstergeleri (tamamlanma, eksik zorunlu alanlar, yayına uygunluk) tek yükte döner.
/// </summary>
public class GrantParameterDto : EntityDto<Guid>
{
    // --- Program Kimliği ---
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? SourceUrl { get; set; }

    // --- Uygunluk Şartları ---
    public int EligibleCompanySizes { get; set; }
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
    public bool PrefersFemaleEntrepreneur { get; set; }
    public bool PrefersYoungEntrepreneur { get; set; }
    public List<GrantCriteriaTagDto> CriteriaTags { get; set; } = new();

    // --- Finansal Yapı ---
    public decimal? MaxAmount { get; set; }
    public int? SupportRatePercent { get; set; }

    /// <summary>Türetilmiş, salt-okunur: 100 − destek oranı. Saklanmaz.</summary>
    public int? CoFinancingRatePercent { get; set; }

    public int? ProjectDurationMonths { get; set; }
    public GrantRepaymentType RepaymentType { get; set; }
    public bool HasAdvancePayment { get; set; }
    public bool RequiresGuaranteeLetter { get; set; }
    public List<GrantEligibleCostItemDto> EligibleCostItems { get; set; } = new();

    // --- Evrak & Belgeler ---
    public List<GrantDocumentRequirementDto> DocumentRequirements { get; set; } = new();

    // --- Süreç Şablonu ---
    public Guid? StageTemplateId { get; set; }
    public string? StageTemplateName { get; set; }
    public int StageStepCount { get; set; }

    // --- Eşleştirme eşiği ---
    public double MinMatchScore { get; set; }

    // --- Form durumu ---
    /// <summary>Dolu parametrelerin toplam parametreye oranı (%). Sol navdaki ilerleme çubuğu.</summary>
    public int CompletionPercent { get; set; }

    /// <summary>Yayın için eksik zorunlu alanların ANAHTARLARI — metin istemcide yerelleştirilir.</summary>
    public List<string> MissingRequiredFields { get; set; } = new();

    /// <summary>Yayınlanmayı bekleyen taslak çağrı sayısı.</summary>
    public int DraftCallCount { get; set; }

    /// <summary>Yayınla düğmesi: eksik zorunlu alan yoksa VE yayınlanacak taslak çağrı varsa aktif.</summary>
    public bool CanPublish { get; set; }
}
