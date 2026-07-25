using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants.Dtos;

/// <summary>Host toplu-gönder aksiyonu.</summary>
public class SendHostRecommendationInput
{
    public Guid GrantCallId { get; set; }
    public List<Guid> TenantIds { get; set; } = new();
    public string? Note { get; set; }
}
