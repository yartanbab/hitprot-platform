using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Ai.Tenants;

public class UpdateTenantAiSettingsDto
{
    [Required, StringLength(64)]
    public string PreferredProvider { get; set; } = "openai";

    [Required, StringLength(128)]
    public string PreferredModel { get; set; } = "gpt-4o-mini";

    [Range(0, int.MaxValue)]
    public int MonthlyTokenQuota { get; set; } = 100_000;

    public bool IsEnabled { get; set; } = true;
}
