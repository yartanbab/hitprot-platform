using System.Threading;
using System.Threading.Tasks;

namespace Apya.Platform.Ai.Providers;

/// <summary>Resolved (decrypted) credentials + model for a provider in the current tenant context.</summary>
public record AiProviderCredentials(string ApiKey, string Model);

/// <summary>
/// Resolves per-tenant provider credentials from <c>AiProviderConfig</c> (decrypting the stored key).
/// Returns null when the provider is not configured/enabled for the current tenant.
/// </summary>
public interface IAiProviderCredentialStore
{
    Task<AiProviderCredentials?> ResolveAsync(AiProviderType provider, CancellationToken cancellationToken = default);
}
