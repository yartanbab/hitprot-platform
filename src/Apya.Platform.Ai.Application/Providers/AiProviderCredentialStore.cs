using System;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Encryption;

namespace Apya.Platform.Ai.Providers;

public class AiProviderCredentialStore : IAiProviderCredentialStore, ITransientDependency
{
    private readonly IRepository<AiProviderConfig, Guid> _repository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IStringEncryptionService _encryptionService;

    public AiProviderCredentialStore(
        IRepository<AiProviderConfig, Guid> repository,
        ICurrentTenant currentTenant,
        IStringEncryptionService encryptionService)
    {
        _repository = repository;
        _currentTenant = currentTenant;
        _encryptionService = encryptionService;
    }

    public async Task<AiProviderCredentials?> ResolveAsync(AiProviderType provider, CancellationToken cancellationToken = default)
    {
        var config = await _repository.FirstOrDefaultAsync(
            x => x.TenantId == _currentTenant.Id && x.Provider == provider && x.IsEnabled,
            cancellationToken);

        if (config is null || !config.HasApiKey)
            return null;

        var apiKey = _encryptionService.Decrypt(config.ApiKey!);
        if (string.IsNullOrWhiteSpace(apiKey))
            return null;

        return new AiProviderCredentials(apiKey, config.Model);
    }
}
