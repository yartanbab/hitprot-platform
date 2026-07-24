using System;
using Apya.Platform.Projects;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Host toplu-gönder önizleme filtresi.</summary>
public class PreviewHostRecommendationInput
{
    public Guid GrantCallId { get; set; }
    public int? Sizes { get; set; }
    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public ProjectCategory? Category { get; set; }
    public int MinScore { get; set; }
}
