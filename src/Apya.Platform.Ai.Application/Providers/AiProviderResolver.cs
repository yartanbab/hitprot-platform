using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Ai.Tenants;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Providers;

public class AiProviderResolver : IAiProviderResolver, ITransientDependency
{
    private const string DefaultProvider = "openai";

    private readonly IEnumerable<INamedAiProvider> _providers;
    private readonly IRepository<TenantAiSettings, Guid> _settingsRepository;
    private readonly ICurrentTenant _currentTenant;

    public AiProviderResolver(
        IEnumerable<INamedAiProvider> providers,
        IRepository<TenantAiSettings, Guid> settingsRepository,
        ICurrentTenant currentTenant)
    {
        _providers = providers;
        _settingsRepository = settingsRepository;
        _currentTenant = currentTenant;
    }

    public INamedAiProvider Resolve(string providerName)
    {
        var provider = _providers.FirstOrDefault(
            p => string.Equals(p.Name, providerName, StringComparison.OrdinalIgnoreCase));

        if (provider == null)
            throw new AiProviderException(
                PlatformDomainErrorCodes.AiProviderNotConfigured,
                $"AI sağlayıcı '{providerName}' kayıtlı değil.");

        return provider;
    }

    public async Task<INamedAiProvider> ResolveForTenantAsync(CancellationToken cancellationToken = default)
    {
        var settings = await _settingsRepository.FirstOrDefaultAsync(
            x => x.TenantId == _currentTenant.Id, cancellationToken);

        var name = string.IsNullOrWhiteSpace(settings?.PreferredProvider)
            ? DefaultProvider
            : settings!.PreferredProvider;

        return Resolve(name);
    }
}
