using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>1c · Aday firma satırı — skor, neden uygun, boyut kırılımı ve uyarı.</summary>
public class HostRecommendationCandidateDto
{
    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public int Score { get; set; }
    public CompanySize? Size { get; set; }

    public GrantEligibilityBucket Bucket { get; set; }

    /// <summary>"Neden uygun" chip'leri — kanıtlı sağlanan şartlar.</summary>
    public List<GrantEligibilityRule> PassedRules { get; set; } = new();

    /// <summary>Satırın altındaki uyarı: eleyen ya da ölçülemeyen ilk şart.</summary>
    public GrantEligibilityRule? WarningRule { get; set; }
    public string? WarningFirmValue { get; set; }
    public string? WarningGrantValue { get; set; }

    /// <summary>Skorun boyut kırılımı — satır içindeki mini barlar.</summary>
    public List<GrantScoreDimensionDto> Dimensions { get; set; } = new();

    /// <summary>Bu çağrı bu firmaya daha önce gönderildi mi.</summary>
    public bool AlreadySent { get; set; }

    public bool AlreadyApplied { get; set; }

    public Guid? AssignedUserId { get; set; }
    public string? AssignedUserName { get; set; }
}

/// <summary>1c · Danışman (host kullanıcısı) ve üzerindeki yük.</summary>
public class GrantConsultantDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;

    /// <summary>Bu danışmana atanmış açık öneri sayısı — "danışman yükü".</summary>
    public int AssignedCount { get; set; }
}

/// <summary>1c · Ekranın tek yükü: çağrı başlığı, adaylar, danışmanlar ve fırsat kartı.</summary>
public class GrantDispatchConsoleDto
{
    public Guid GrantCallId { get; set; }
    public Guid GrantId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }
    public decimal? MaxAmount { get; set; }

    /// <summary>Programın kendi uyum eşiği — süzgeçteki "programın eşiği %70" notu.</summary>
    public double GrantMinMatchScore { get; set; }

    /// <summary>Süzgeçten geçen adaylar.</summary>
    public List<HostRecommendationCandidateDto> Candidates { get; set; } = new();

    /// <summary>Süzgeç uygulanmadan önceki toplam firma sayısı.</summary>
    public int TotalFirms { get; set; }

    public List<GrantConsultantDto> Consultants { get; set; } = new();

    /// <summary>
    /// Danışmanlık fırsatı: diğer tüm şartları sağlayan ama konsorsiyum ortağı olmayan
    /// firma sayısı — "N firma uygun ama konsorsiyum ortağı yok" kartı.
    /// </summary>
    public int ConsortiumOpportunityCount { get; set; }
}

/// <summary>1c · Gönderim sonucu.</summary>
public class GrantDispatchResultDto
{
    public int SentCount { get; set; }

    /// <summary>Zaten gönderilmiş olduğu için atlanan firma sayısı (gönderim idempotenttir).</summary>
    public int SkippedCount { get; set; }

    public int NotifiedUserCount { get; set; }
    public int EmailCount { get; set; }
}
