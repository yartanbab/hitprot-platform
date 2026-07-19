using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Manages form categories (tenant-scoped). Reading requires only form access;
/// mutating requires the ManageCategories permission.
/// </summary>
[Authorize(PlatformPermissions.DynamicAssets.Default)]
public class FormCategoryAppService : PlatformAppService, IFormCategoryAppService
{
    private readonly IRepository<FormCategory, Guid> _repository;

    public FormCategoryAppService(IRepository<FormCategory, Guid> repository)
    {
        _repository = repository;
    }

    public async Task<FormCategoryDto> GetAsync(Guid id)
    {
        var category = await _repository.GetAsync(id);
        return ObjectMapper.Map<FormCategory, FormCategoryDto>(category);
    }

    public async Task<PagedResultDto<FormCategoryDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var queryable = await _repository.GetQueryableAsync();

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var query = queryable
            .OrderBy(c => c.Order)
            .ThenBy(c => c.Name)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        var items = await AsyncExecuter.ToListAsync(query);

        return new PagedResultDto<FormCategoryDto>(
            totalCount,
            ObjectMapper.Map<List<FormCategory>, List<FormCategoryDto>>(items));
    }

    [Authorize(PlatformPermissions.DynamicAssets.ManageCategories)]
    public async Task<FormCategoryDto> CreateAsync(CreateUpdateFormCategoryDto input)
    {
        var category = new FormCategory(
            GuidGenerator.Create(),
            input.Name,
            input.Color,
            input.Icon,
            input.Order);

        await _repository.InsertAsync(category, autoSave: true);

        return ObjectMapper.Map<FormCategory, FormCategoryDto>(category);
    }

    [Authorize(PlatformPermissions.DynamicAssets.ManageCategories)]
    public async Task<FormCategoryDto> UpdateAsync(Guid id, CreateUpdateFormCategoryDto input)
    {
        var category = await _repository.GetAsync(id);

        category.SetName(input.Name);
        category.SetColor(input.Color);
        category.SetIcon(input.Icon);
        category.SetOrder(input.Order);

        await _repository.UpdateAsync(category, autoSave: true);

        return ObjectMapper.Map<FormCategory, FormCategoryDto>(category);
    }

    [Authorize(PlatformPermissions.DynamicAssets.ManageCategories)]
    public async Task DeleteAsync(Guid id)
    {
        await _repository.DeleteAsync(id);
    }
}
