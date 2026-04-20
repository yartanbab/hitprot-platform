using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Application service interface for managing instantiated documents (IsTemplate = false).
/// </summary>
public interface IDynamicDocumentAppService : IApplicationService
{
    Task<DocumentDto> InstantiateFromTemplateAsync(InstantiateDocumentDto input);
    Task<DocumentDto> GetAsync(Guid id);
    Task<DocumentDto> GetBySlugAsync(string slug);
    Task<PagedResultDto<DocumentDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task DeleteAsync(Guid id);
}
