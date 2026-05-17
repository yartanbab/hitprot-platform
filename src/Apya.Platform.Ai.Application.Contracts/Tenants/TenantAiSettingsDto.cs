using System;

namespace Apya.Platform.Ai.Tenants;

public class TenantAiSettingsDto
{
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }
    public string PreferredProvider { get; set; } = "openai";
    public string PreferredModel { get; set; } = "gpt-4o-mini";
    public int MonthlyTokenQuota { get; set; }
    public int TokensUsedThisMonth { get; set; }
    public int RemainingTokens { get; set; }
    public DateTime QuotaPeriodStart { get; set; }
    public bool IsEnabled { get; set; }
}
