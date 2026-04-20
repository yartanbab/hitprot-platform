using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Application service interface for managing template documents (IsTemplate = true).
/// </summary>
public interface ITemplateAppService : IApplicationService
{
    Task<DocumentDto> CreateAsync(CreateTemplateDto input);
    Task<DocumentDto> GetAsync(Guid id);
    Task<PagedResultDto<DocumentDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task DeleteAsync(Guid id);
}
