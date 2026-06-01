using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Prompts.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Ai.Prompts;

[Authorize(AiPermissions.Prompts.Default)]
public class PromptAppService : ApplicationService, IPromptAppService
{
    private readonly IPromptRepository _promptRepository;

    public PromptAppService(IPromptRepository promptRepository)
    {
        _promptRepository = promptRepository;
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<PagedResultDto<PromptDto>> GetListAsync(GetPromptsInput input)
    {
        var queryable = await _promptRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            var filter = input.Filter.Trim();
            queryable = queryable.Where(p => p.Code.Contains(filter) || p.Name.Contains(filter));
        }
        if (input.CategoryId.HasValue)
            queryable = queryable.Where(p => p.CategoryId == input.CategoryId);
        if (input.IsActive.HasValue)
        {
            var isActive = input.IsActive.Value;
            queryable = queryable.Where(p => p.IsActive == isActive);
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var items = await AsyncExecuter.ToListAsync(
            queryable
                .OrderBy(p => p.Name)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .Select(p => new PromptDto
                {
                    Id = p.Id,
                    Code = p.Code,
                    Name = p.Name,
                    Description = p.Description,
                    CategoryId = p.CategoryId,
                    ActiveVersionId = p.ActiveVersionId,
                    IsActive = p.IsActive,
                    VersionCount = p.Versions.Count
                }));

        return new PagedResultDto<PromptDto>(totalCount, items);
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<PromptDetailDto> GetAsync(Guid id)
    {
        var prompt = await _promptRepository.GetWithVersionsAsync(id)
            ?? throw new EntityNotFoundException(typeof(Prompt), id);

        return MapToDetailDto(prompt);
    }

    [Authorize(AiPermissions.Prompts.Create)]
    public async Task<PromptDto> CreateAsync(CreatePromptDto input)
    {
        if (await _promptRepository.CodeExistsAsync(input.Code))
            throw new BusinessException(PlatformDomainErrorCodes.PromptCodeAlreadyExists)
                .WithData("Code", input.Code);

        var prompt = new Prompt(
            GuidGenerator.Create(),
            input.Code,
            input.Name,
            input.Description,
            input.CategoryId,
            CurrentTenant.Id);

        prompt.AddVersion(
            GuidGenerator.Create(),
            input.SystemPrompt,
            input.UserPromptTemplate,
            input.JsonSchema,
            input.ExpectedOutputSample);

        await _promptRepository.InsertAsync(prompt, autoSave: true);
        return MapToDto(prompt);
    }

    [Authorize(AiPermissions.Prompts.Edit)]
    public async Task<PromptDto> UpdateAsync(Guid id, UpdatePromptDto input)
    {
        var prompt = await _promptRepository.GetWithVersionsAsync(id)
            ?? throw new EntityNotFoundException(typeof(Prompt), id);

        prompt.SetName(input.Name);
        prompt.SetDescription(input.Description);
        prompt.SetCategory(input.CategoryId);
        if (input.IsActive) prompt.Activate(); else prompt.Deactivate();

        await _promptRepository.UpdateAsync(prompt, autoSave: true);
        return MapToDto(prompt);
    }

    [Authorize(AiPermissions.Prompts.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _promptRepository.DeleteAsync(id);
    }

    [Authorize(AiPermissions.Prompts.Edit)]
    public async Task<PromptVersionDto> AddVersionAsync(Guid id, CreatePromptVersionDto input)
    {
        var prompt = await _promptRepository.GetWithVersionsAsync(id)
            ?? throw new EntityNotFoundException(typeof(Prompt), id);

        var version = prompt.AddVersion(
            GuidGenerator.Create(),
            input.SystemPrompt,
            input.UserPromptTemplate,
            input.JsonSchema,
            input.ExpectedOutputSample);

        await _promptRepository.UpdateAsync(prompt, autoSave: true);
        return MapToVersionDto(version);
    }

    [Authorize(AiPermissions.Prompts.Publish)]
    public async Task PublishVersionAsync(Guid id, Guid versionId)
    {
        var prompt = await _promptRepository.GetWithVersionsAsync(id)
            ?? throw new EntityNotFoundException(typeof(Prompt), id);

        prompt.PublishVersion(versionId, Clock.Now);
        await _promptRepository.UpdateAsync(prompt, autoSave: true);
    }

    // --- Explicit, AutoMapper-free projections (R-5 mitigation) ---

    private static PromptDto MapToDto(Prompt p) => new()
    {
        Id = p.Id,
        Code = p.Code,
        Name = p.Name,
        Description = p.Description,
        CategoryId = p.CategoryId,
        ActiveVersionId = p.ActiveVersionId,
        IsActive = p.IsActive,
        VersionCount = p.Versions.Count
    };

    private static PromptDetailDto MapToDetailDto(Prompt p)
    {
        return new PromptDetailDto
        {
            Id = p.Id,
            Code = p.Code,
            Name = p.Name,
            Description = p.Description,
            CategoryId = p.CategoryId,
            ActiveVersionId = p.ActiveVersionId,
            IsActive = p.IsActive,
            VersionCount = p.Versions.Count,
            Versions = p.Versions
                .OrderBy(v => v.VersionNo)
                .Select(MapToVersionDto)
                .ToList()
        };
    }

    private static PromptVersionDto MapToVersionDto(PromptVersion v) => new()
    {
        Id = v.Id,
        PromptId = v.PromptId,
        VersionNo = v.VersionNo,
        SystemPrompt = v.SystemPrompt,
        UserPromptTemplate = v.UserPromptTemplate,
        JsonSchema = v.JsonSchema,
        ExpectedOutputSample = v.ExpectedOutputSample,
        Status = v.Status,
        PublishedAt = v.PublishedAt
    };
}
