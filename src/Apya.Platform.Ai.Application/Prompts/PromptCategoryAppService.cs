using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Prompts.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai.Prompts;

[Authorize(AiPermissions.Prompts.Default)]
public class PromptCategoryAppService : ApplicationService, IPromptCategoryAppService
{
    private readonly IRepository<PromptCategory, Guid> _categoryRepository;

    public PromptCategoryAppService(IRepository<PromptCategory, Guid> categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<List<PromptCategoryDto>> GetListAsync()
    {
        var list = await _categoryRepository.GetListAsync();
        return list
            .OrderBy(c => c.Name)
            .Select(MapToDto)
            .ToList();
    }

    [Authorize(AiPermissions.Prompts.View)]
    public async Task<PromptCategoryDto> GetAsync(Guid id)
    {
        var category = await _categoryRepository.GetAsync(id);
        return MapToDto(category);
    }

    [Authorize(AiPermissions.Prompts.Edit)]
    public async Task<PromptCategoryDto> CreateAsync(CreateUpdatePromptCategoryDto input)
    {
        var category = new PromptCategory(
            GuidGenerator.Create(),
            input.Name,
            input.Code,
            input.ParentId,
            input.Description,
            CurrentTenant.Id);

        await _categoryRepository.InsertAsync(category, autoSave: true);
        return MapToDto(category);
    }

    [Authorize(AiPermissions.Prompts.Edit)]
    public async Task<PromptCategoryDto> UpdateAsync(Guid id, CreateUpdatePromptCategoryDto input)
    {
        var category = await _categoryRepository.GetAsync(id);

        category.SetName(input.Name);
        category.SetCode(input.Code);
        category.SetParent(input.ParentId);
        category.SetDescription(input.Description);

        await _categoryRepository.UpdateAsync(category, autoSave: true);
        return MapToDto(category);
    }

    [Authorize(AiPermissions.Prompts.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _categoryRepository.DeleteAsync(id);
    }

    private static PromptCategoryDto MapToDto(PromptCategory c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Code = c.Code,
        ParentId = c.ParentId,
        Description = c.Description
    };
}
