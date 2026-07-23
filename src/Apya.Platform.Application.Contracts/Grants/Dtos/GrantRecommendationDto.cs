using System;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Tenant öneri feed öğesi — canlı hesaplanır (kalıcı değil).</summary>
public class GrantRecommendationDto
{
    public Guid GrantCallId { get; set; }
    public Guid GrantId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public int? DaysRemaining { get; set; }
    public decimal? MaxAmount { get; set; }
    public int Score { get; set; }
    public bool AlreadyApplied { get; set; }
}
