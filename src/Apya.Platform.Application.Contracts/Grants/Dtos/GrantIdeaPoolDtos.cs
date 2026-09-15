using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>19a · Fikir Havuzu süzgeci.</summary>
public class GetGrantIdeaPoolInput
{
    /// <summary>null = tüm kaynaklar.</summary>
    public GrantInterestSource? Source { get; set; }

    public GrantIdeaPoolSort Sort { get; set; }
}

public class GrantIdeaPoolDto
{
    public List<GrantIdeaRowDto> Items { get; set; } = new();

    /// <summary>Süzgeçten bağımsız: havuzdaki bekleyen fikir sayısı (menü rozeti ve boş durum ayrımı).</summary>
    public int TotalCount { get; set; }

    /// <summary>"Fikir ekle" penceresinin firma seçenekleri.</summary>
    public List<GrantRequestOptionDto> Firms { get; set; } = new();
}

public class GrantIdeaRowDto
{
    public Guid Id { get; set; }

    public Guid TenantId { get; set; }

    public string FirmName { get; set; } = string.Empty;

    /// <summary>Proje fikri — formun ilk sorusu.</summary>
    public string? Idea { get; set; }

    public GrantInterestSource Source { get; set; }

    /// <summary>Kaydı giren kişi: firma kullanıcısı ya da danışman.</summary>
    public string? CreatorName { get; set; }

    public DateTime CreationTime { get; set; }

    public decimal? EstimatedBudget { get; set; }

    public DateTime? TargetStartDate { get; set; }
}

/// <summary>19a · Fikrin tamamı — dokuz sorunun cevapları.</summary>
public class GrantIdeaDetailDto : GrantIdeaRowDto
{
    public string? ProblemStatement { get; set; }
    public string? TargetAudience { get; set; }
    public string? PlannedActivities { get; set; }
    public string? DurationAndPartners { get; set; }
    public string? SupportNeeds { get; set; }
    public string? PriorExperience { get; set; }
    public string? TeamStructure { get; set; }
    public string? Stakeholders { get; set; }
}
