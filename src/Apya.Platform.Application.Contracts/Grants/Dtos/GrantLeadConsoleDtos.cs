using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>5a · Ön değerlendirme talepleri konsolu.</summary>
public class GrantLeadConsoleDto
{
    public List<GrantLeadRowDto> Items { get; set; } = new();

    // --- KPI'lar ---

    /// <summary>Son yedi günde gelen talep.</summary>
    public int ThisWeekCount { get; set; }

    /// <summary>Isı eşiğini geçen açık talep.</summary>
    public int QualifiedCount { get; set; }

    public int MeetingCount { get; set; }

    /// <summary>Randevuya dönen talebin nitelikliye oranı; örneklem küçükse null.</summary>
    public int? MeetingRatePercent { get; set; }

    public int ConvertedCount { get; set; }

    /// <summary>Açık taleplerin tahmini destek toplamı.</summary>
    public decimal PipelineAmount { get; set; }

    /// <summary>Isı eşiği — ekran "nitelikli" etiketini buna göre yazar.</summary>
    public int QualifiedThreshold { get; set; }

    public int CallThreshold { get; set; }
}

public class GrantLeadRowDto
{
    public Guid Id { get; set; }
    public string FirmName { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string? ContactTitle { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public DateTime CreationTime { get; set; }

    public int HeatScore { get; set; }
    public int PassedRuleCount { get; set; }
    public int TotalRuleCount { get; set; }
    public decimal? EstimatedSupport { get; set; }
    public int Difficulty { get; set; }
    public GrantLeadStatus Status { get; set; }

    public List<GrantLeadSignal> Signals { get; set; } = new();

    public DateTime? PreferredMeetingAt { get; set; }
    public bool IsConverted { get; set; }
}

public class GrantLeadDetailDto : GrantLeadRowDto
{
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Note { get; set; }

    // Testten gelen cevaplar
    public CompanySize? Size { get; set; }
    public int? CompanyAgeYears { get; set; }
    public string? Sector { get; set; }
    public int? RdStaffCount { get; set; }
    public int? Trl { get; set; }
    public decimal? AnnualRevenue { get; set; }
    public bool? HasConsortiumPartner { get; set; }

    public Guid? ConvertedTenantId { get; set; }

    /// <summary>Danışman yükü — host kullanıcısı başına açık başvuru sayısı.</summary>
    public List<GrantConsultantLoadDto> ConsultantLoads { get; set; } = new();
}

public class GrantConsultantLoadDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OpenApplicationCount { get; set; }
}

public class SetGrantLeadStatusInput
{
    [Required(ErrorMessage = "Talep seçilmedi.")]
    public Guid LeadId { get; set; }

    public GrantLeadStatus Status { get; set; }

    [StringLength(1000, ErrorMessage = "Not en fazla 1000 karakter olabilir.")]
    public string? Note { get; set; }
}

public class ConvertGrantLeadInput
{
    [Required(ErrorMessage = "Talep seçilmedi.")]
    public Guid LeadId { get; set; }

    /// <summary>Açılacak kiracının adı. Boşsa firma adı kullanılır.</summary>
    [StringLength(64, ErrorMessage = "Kiracı adı en fazla 64 karakter olabilir.")]
    public string? TenantName { get; set; }
}

public class GrantLeadConversionResultDto
{
    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;

    /// <summary>Firma profilinin doluluk yüzdesi — testten gelen cevaplarla.</summary>
    public int ProfileCompletionPercent { get; set; }
}
