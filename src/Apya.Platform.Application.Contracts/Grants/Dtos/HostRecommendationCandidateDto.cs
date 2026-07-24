using System;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Host toplu-gönder önizleme satırı.</summary>
public class HostRecommendationCandidateDto
{
    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public int Score { get; set; }
}
