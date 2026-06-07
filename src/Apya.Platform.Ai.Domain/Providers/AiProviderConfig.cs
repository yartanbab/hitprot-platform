using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Providers;

/// <summary>
/// Per-tenant configuration for one AI provider (credentials + default model). A tenant may have
/// several configs (one per provider); at most one is the default. The <see cref="ApiKey"/> holds
/// an encrypted value supplied by the application layer (IStringEncryptionService) and is never
/// exposed back through DTOs.
/// </summary>
public class AiProviderConfig : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public AiProviderType Provider { get; private set; }

    public string DisplayName { get; private set; } = null!;

    public string Model { get; private set; } = null!;

    /// <summary>Encrypted at rest (ciphertext). Decrypted only by the provider engine when calling out.</summary>
    public string? ApiKey { get; private set; }

    public bool IsDefault { get; private set; }

    public bool IsEnabled { get; private set; }

    protected AiProviderConfig() { }

    public AiProviderConfig(
        Guid id,
        AiProviderType provider,
        string displayName,
        string model,
        string? apiKey = null,
        Guid? tenantId = null) : base(id)
    {
        Provider = provider;
        SetDisplayName(displayName);
        SetModel(model);
        ApiKey = apiKey;
        TenantId = tenantId;
        IsEnabled = true;
    }

    public void SetDisplayName(string displayName) =>
        DisplayName = Check.NotNullOrWhiteSpace(displayName, nameof(displayName), maxLength: ProviderConsts.MaxDisplayNameLength);

    public void SetModel(string model) =>
        Model = Check.NotNullOrWhiteSpace(model, nameof(model), maxLength: ProviderConsts.MaxModelLength);

    /// <summary>Stores the already-encrypted key. Null/blank leaves the existing key untouched is handled by the app layer.</summary>
    public void SetApiKey(string encryptedApiKey) => ApiKey = encryptedApiKey;

    public bool HasApiKey => !string.IsNullOrWhiteSpace(ApiKey);

    public void Enable() => IsEnabled = true;

    public void Disable() => IsEnabled = false;

    public void MarkDefault() => IsDefault = true;

    public void ClearDefault() => IsDefault = false;
}
