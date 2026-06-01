using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Bindings.Dtos;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.DynamicAssets;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai.Bindings;

[Authorize(AiPermissions.Prompts.Default)]
public class AiFormBindingAppService : ApplicationService, IAiFormBindingAppService
{
    private readonly IRepository<AiFormBinding, Guid> _bindingRepository;
    private readonly IRepository<AppDocument, Guid> _documentRepository;
    private readonly IRepository<Prompt, Guid> _promptRepository;

    public AiFormBindingAppService(
        IRepository<AiFormBinding, Guid> bindingRepository,
        IRepository<AppDocument, Guid> documentRepository,
        IRepository<Prompt, Guid> promptRepository)
    {
        _bindingRepository = bindingRepository;
        _documentRepository = documentRepository;
        _promptRepository = promptRepository;
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<List<AiFormBindingDto>> GetListAsync()
    {
        var bindings = await _bindingRepository.GetListAsync();
        if (bindings.Count == 0)
            return new List<AiFormBindingDto>();

        var documentIds = bindings.Select(b => b.DocumentId).Distinct().ToList();
        var promptIds = bindings.Select(b => b.PromptId).Distinct().ToList();

        var documents = await _documentRepository.GetListAsync(d => documentIds.Contains(d.Id));
        var prompts = await _promptRepository.GetListAsync(p => promptIds.Contains(p.Id));

        var documentTitles = documents.ToDictionary(d => d.Id, d => d.Title);
        var promptNames = prompts.ToDictionary(p => p.Id, p => p.Name);

        return bindings
            .OrderBy(b => b.Order)
            .Select(b => Map(b, documentTitles.GetValueOrDefault(b.DocumentId), promptNames.GetValueOrDefault(b.PromptId)))
            .ToList();
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<AiFormBindingDto> GetAsync(Guid id)
    {
        var binding = await _bindingRepository.GetAsync(id);
        return await MapWithLookupsAsync(binding);
    }

    [Authorize(AiPermissions.Prompts.Edit)]
    public async Task<AiFormBindingDto> CreateAsync(CreateUpdateAiFormBindingDto input)
    {
        var binding = new AiFormBinding(
            GuidGenerator.Create(),
            input.DocumentId,
            input.PromptId,
            input.TriggerMode,
            input.Order,
            CurrentTenant.Id);

        if (input.IsActive) binding.Activate(); else binding.Deactivate();

        await _bindingRepository.InsertAsync(binding, autoSave: true);
        return await MapWithLookupsAsync(binding);
    }

    [Authorize(AiPermissions.Prompts.Edit)]
    public async Task<AiFormBindingDto> UpdateAsync(Guid id, CreateUpdateAiFormBindingDto input)
    {
        var binding = await _bindingRepository.GetAsync(id);

        binding.SetTriggerMode(input.TriggerMode);
        binding.SetOrder(input.Order);
        if (input.IsActive) binding.Activate(); else binding.Deactivate();

        await _bindingRepository.UpdateAsync(binding, autoSave: true);
        return await MapWithLookupsAsync(binding);
    }

    [Authorize(AiPermissions.Prompts.Edit)]
    public async Task DeleteAsync(Guid id)
    {
        await _bindingRepository.DeleteAsync(id);
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<List<AiBindingLookupDto>> GetFormLookupAsync()
    {
        var documents = await _documentRepository.GetListAsync();
        return documents
            .OrderBy(d => d.Title)
            .Select(d => new AiBindingLookupDto { Id = d.Id, DisplayName = d.Title })
            .ToList();
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<List<AiBindingLookupDto>> GetPromptLookupAsync()
    {
        var prompts = await _promptRepository.GetListAsync(p => p.IsActive);
        return prompts
            .OrderBy(p => p.Name)
            .Select(p => new AiBindingLookupDto { Id = p.Id, DisplayName = p.Name })
            .ToList();
    }

    private async Task<AiFormBindingDto> MapWithLookupsAsync(AiFormBinding binding)
    {
        var document = await _documentRepository.FindAsync(binding.DocumentId);
        var prompt = await _promptRepository.FindAsync(binding.PromptId);
        return Map(binding, document?.Title, prompt?.Name);
    }

    private static AiFormBindingDto Map(AiFormBinding b, string? documentTitle, string? promptName) => new()
    {
        Id = b.Id,
        DocumentId = b.DocumentId,
        DocumentTitle = documentTitle,
        PromptId = b.PromptId,
        PromptName = promptName,
        TriggerMode = b.TriggerMode,
        VersionPolicy = b.VersionPolicy,
        Order = b.Order,
        IsActive = b.IsActive
    };
}
