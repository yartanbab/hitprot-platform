using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Application service for managing form categories.
/// </summary>
public interface IFormCategoryAppService : IApplicationService
{
    Task<FormCategoryDto> GetAsync(Guid id);
    Task<PagedResultDto<FormCategoryDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task<FormCategoryDto> CreateAsync(CreateUpdateFormCategoryDto input);
    Task<FormCategoryDto> UpdateAsync(Guid id, CreateUpdateFormCategoryDto input);
    Task DeleteAsync(Guid id);
}
