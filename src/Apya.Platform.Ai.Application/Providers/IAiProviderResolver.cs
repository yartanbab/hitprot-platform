using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Apya.Platform.Ai.Providers;

/// <summary>
/// Selects the concrete <see cref="INamedAiProvider"/> to use, either by explicit name or by the
/// current tenant's preferred provider. Keeps provider selection in one place (OCP).
/// </summary>
public interface IAiProviderResolver
{
    INamedAiProvider Resolve(string providerName);

    Task<INamedAiProvider> ResolveForTenantAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Kayıtlı sağlayıcı adları, kayıt sırasıyla — <see cref="Resolve"/>'un kabul ettiği kümenin aynısı.
    /// Kiracı AI ayar ekranının seçenekleri ve kayıt doğrulaması bunu kullanır.
    /// </summary>
    IReadOnlyList<string> GetProviderNames();
}
