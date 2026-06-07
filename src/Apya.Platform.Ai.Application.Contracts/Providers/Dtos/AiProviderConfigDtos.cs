using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.Providers.Dtos;

public class AiProviderConfigDto : EntityDto<Guid>
{
    public AiProviderType Provider { get; set; }
    public string ProviderName => Provider.ToString();
    public string DisplayName { get; set; } = null!;
    public string Model { get; set; } = null!;

    /// <summary>True when a key is stored. The key itself is never returned.</summary>
    public bool HasApiKey { get; set; }

    public bool IsDefault { get; set; }
    public bool IsEnabled { get; set; }
}

public class CreateUpdateAiProviderConfigDto
{
    public AiProviderType Provider { get; set; }

    [Required]
    [StringLength(ProviderConsts.MaxDisplayNameLength)]
    public string DisplayName { get; set; } = null!;

    [Required]
    [StringLength(ProviderConsts.MaxModelLength)]
    public string Model { get; set; } = null!;

    /// <summary>Set/replace the API key. Leave blank on edit to keep the existing key.</summary>
    public string? ApiKey { get; set; }

    public bool IsDefault { get; set; }

    public bool IsEnabled { get; set; } = true;
}
