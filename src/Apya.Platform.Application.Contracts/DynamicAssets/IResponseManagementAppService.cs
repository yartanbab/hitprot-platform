using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Authenticated application service for reviewing and managing form responses
/// (listing, detail, status workflow, tags, reviewer comments).
/// </summary>
public interface IResponseManagementAppService : IApplicationService
{
    Task<PagedResultDto<ResponseListItemDto>> GetListAsync(ResponseListFilterDto input);
    Task<ResponseDetailDto> GetAsync(Guid id);
    Task<ResponseDetailDto> SetStatusAsync(Guid id, SetResponseStatusDto input);
    Task<ResponseDetailDto> SetTagsAsync(Guid id, SetResponseTagsDto input);
    Task<ResponseCommentDto> AddCommentAsync(Guid id, AddResponseCommentDto input);
    Task DeleteCommentAsync(Guid id, Guid commentId);
}
