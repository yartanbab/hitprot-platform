using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 1e · Kiracı hibe detayı. Uygunluk tablosu, bütçe hesaplayıcının girdileri, süreç ve
/// evrak listesi, uyum kırılımı ve zorluk değerlendirmesi tek yükte döner.
/// </summary>
public class GrantCallDetailDto
{
    public Guid GrantCallId { get; set; }
    public Guid GrantId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? SourceUrl { get; set; }
    public string Period { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }

    public decimal? MaxAmount { get; set; }
    public int? SupportRatePercent { get; set; }

    /// <summary>Türetilmiş: 100 − destek oranı.</summary>
    public int? CoFinancingRatePercent { get; set; }

    public int? ProjectDurationMonths { get; set; }
    public GrantRepaymentType RepaymentType { get; set; }
    public bool HasAdvancePayment { get; set; }
    public bool RequiresGuaranteeLetter { get; set; }

    // --- Uygunluk kontrolü tablosu ---
    public GrantEligibilityBucket Bucket { get; set; }
    public List<GrantRuleCheckDto> Rules { get; set; } = new();

    /// <summary>Eksik şartların hiçbiri eleyici değilse true — tablonun altındaki not.</summary>
    public bool MissingRulesAreNotBlocking { get; set; }

    // --- Bütçe hesaplayıcı ---
    public List<GrantEligibleCostItemDto> CostItems { get; set; } = new();

    // --- Süreç ve evrak ---
    public List<GrantStageTemplateStepDto> StageSteps { get; set; } = new();
    public List<GrantDocumentRequirementDto> Documents { get; set; } = new();

    // --- Sağ panel ---
    public int Score { get; set; }
    public List<GrantScoreDimensionDto> ScoreDimensions { get; set; } = new();
    public int Difficulty { get; set; }
    public List<GrantDifficultyReason> DifficultyReasons { get; set; } = new();

    /// <summary>Zorluk 4+ ise "tek başınıza yürütmenizi önermiyoruz" uyarısı gösterilir.</summary>
    public bool IsHard { get; set; }

    public List<GrantSimilarCallDto> Similar { get; set; } = new();

    public bool AlreadyApplied { get; set; }
    public bool IsBookmarked { get; set; }

    // --- İlgi talebi (son kayıt) ---

    /// <summary>Hiç talep bırakılmadıysa null — buton "İlgileniyorum" olarak çıkar.</summary>
    public GrantInterestStatus? InterestStatus { get; set; }

    /// <summary>Uygun bulunmadıysa host'un gerekçesi; kiracıya birebir gösterilir.</summary>
    public string? InterestFeedback { get; set; }

    /// <summary>Süreç başlatıldıysa açılan başvuru — "Başvuruya git" bağlantısı.</summary>
    public Guid? InterestApplicationId { get; set; }
}

/// <summary>1e · Uygunluk tablosunun tek satırı.</summary>
public class GrantRuleCheckDto
{
    public GrantEligibilityRule Rule { get; set; }
    public GrantRuleOutcome Outcome { get; set; }

    /// <summary>Firmanın değeri — yoksa null ("girilmemiş").</summary>
    public string? FirmValue { get; set; }

    /// <summary>Programın istediği değer/aralık.</summary>
    public string? GrantValue { get; set; }
}

public class GrantScoreDimensionDto
{
    public GrantMatchDimension Dimension { get; set; }
    public int Value { get; set; }
    public double Weight { get; set; }
}

public class GrantSimilarCallDto
{
    public Guid GrantCallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public int Score { get; set; }
}
