using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Providers.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Encryption;

namespace Apya.Platform.Ai.Providers;

[Authorize(AiPermissions.Providers.Default)]
public class AiProviderAppService : ApplicationService, IAiProviderAppService
{
    private readonly IRepository<AiProviderConfig, Guid> _repository;
    private readonly IStringEncryptionService _encryptionService;

    public AiProviderAppService(
        IRepository<AiProviderConfig, Guid> repository,
        IStringEncryptionService encryptionService)
    {
        _repository = repository;
        _encryptionService = encryptionService;
    }

    public async Task<List<AiProviderConfigDto>> GetListAsync()
    {
        var list = await _repository.GetListAsync();
        return list
            .OrderByDescending(x => x.IsDefault)
            .ThenBy(x => x.DisplayName)
            .Select(MapToDto)
            .ToList();
    }

    public async Task<AiProviderConfigDto> GetAsync(Guid id)
    {
        return MapToDto(await _repository.GetAsync(id));
    }

    [Authorize(AiPermissions.Providers.Manage)]
    public async Task<AiProviderConfigDto> CreateAsync(CreateUpdateAiProviderConfigDto input)
    {
        var config = new AiProviderConfig(
            GuidGenerator.Create(),
            input.Provider,
            input.DisplayName,
            input.Model,
            EncryptOrNull(input.ApiKey),
            CurrentTenant.Id);

        if (input.IsEnabled) config.Enable(); else config.Disable();

        await _repository.InsertAsync(config, autoSave: true);

        if (input.IsDefault)
            await SetDefaultInternalAsync(config);

        return MapToDto(config);
    }

    [Authorize(AiPermissions.Providers.Manage)]
    public async Task<AiProviderConfigDto> UpdateAsync(Guid id, CreateUpdateAiProviderConfigDto input)
    {
        var config = await _repository.GetAsync(id);

        config.SetDisplayName(input.DisplayName);
        config.SetModel(input.Model);

        // Blank key on edit means "keep the existing key".
        if (!string.IsNullOrWhiteSpace(input.ApiKey))
            config.SetApiKey(_encryptionService.Encrypt(input.ApiKey)!);

        if (input.IsEnabled) config.Enable(); else config.Disable();

        await _repository.UpdateAsync(config, autoSave: true);

        if (input.IsDefault)
            await SetDefaultInternalAsync(config);

        return MapToDto(config);
    }

    [Authorize(AiPermissions.Providers.Manage)]
    public async Task DeleteAsync(Guid id)
    {
        await _repository.DeleteAsync(id);
    }

    [Authorize(AiPermissions.Providers.Manage)]
    public async Task SetDefaultAsync(Guid id)
    {
        var config = await _repository.GetAsync(id);
        await SetDefaultInternalAsync(config);
    }

    private async Task SetDefaultInternalAsync(AiProviderConfig config)
    {
        var others = await _repository.GetListAsync(x => x.IsDefault && x.Id != config.Id);
        foreach (var other in others)
        {
            other.ClearDefault();
            await _repository.UpdateAsync(other);
        }

        config.MarkDefault();
        await _repository.UpdateAsync(config, autoSave: true);
    }

    private string? EncryptOrNull(string? plain) =>
        string.IsNullOrWhiteSpace(plain) ? null : _encryptionService.Encrypt(plain);

    private static AiProviderConfigDto MapToDto(AiProviderConfig c) => new()
    {
        Id = c.Id,
        Provider = c.Provider,
        DisplayName = c.DisplayName,
        Model = c.Model,
        HasApiKey = c.HasApiKey,
        IsDefault = c.IsDefault,
        IsEnabled = c.IsEnabled
    };
}
