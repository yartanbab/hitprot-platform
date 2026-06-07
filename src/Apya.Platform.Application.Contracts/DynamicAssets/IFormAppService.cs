using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Application service for managing forms (non-template AppDocuments) across their lifecycle.
/// </summary>
public interface IFormAppService : IApplicationService
{
    Task<PagedResultDto<FormListItemDto>> GetListAsync(FormListFilterDto input);
    Task<DocumentDto> GetAsync(Guid id);
    Task<DocumentDto> CreateAsync(CreateUpdateFormDto input);
    Task<DocumentDto> UpdateAsync(Guid id, CreateUpdateFormDto input);
    Task<DocumentDto> UpdateBlocksAsync(Guid id, UpdateFormBlocksDto input);
    Task DeleteAsync(Guid id);

    Task<DocumentDto> PublishAsync(Guid id, PublishFormDto input);
    Task<DocumentDto> ArchiveAsync(Guid id);
    Task<DocumentDto> MoveToDraftAsync(Guid id);

    Task<FormStatisticsDto> GetStatisticsAsync(Guid id);
}
