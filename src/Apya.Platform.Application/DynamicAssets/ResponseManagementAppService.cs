using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Review/management of submitted form responses. Requires ViewResponses.
/// </summary>
[Authorize(PlatformPermissions.DynamicAssets.ViewResponses)]
public class ResponseManagementAppService : PlatformAppService, IResponseManagementAppService
{
    private readonly IRepository<AppResponse, Guid> _repository;

    public ResponseManagementAppService(IRepository<AppResponse, Guid> repository)
    {
        _repository = repository;
    }

    public async Task<PagedResultDto<ResponseListItemDto>> GetListAsync(ResponseListFilterDto input)
    {
        var queryable = await _repository.GetQueryableAsync();

        if (input.DocumentId.HasValue)
        {
            queryable = queryable.Where(r => r.DocumentId == input.DocumentId.Value);
        }

        if (input.Status.HasValue)
        {
            queryable = queryable.Where(r => r.Status == input.Status.Value);
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var items = await AsyncExecuter.ToListAsync(
            queryable.OrderByDescending(r => r.CreationTime)
                     .Skip(input.SkipCount)
                     .Take(input.MaxResultCount));

        return new PagedResultDto<ResponseListItemDto>(
            totalCount,
            ObjectMapper.Map<List<AppResponse>, List<ResponseListItemDto>>(items));
    }

    public async Task<ResponseDetailDto> GetAsync(Guid id)
    {
        var response = await GetWithCommentsAsync(id);
        return ObjectMapper.Map<AppResponse, ResponseDetailDto>(response);
    }

    public async Task<ResponseDetailDto> SetStatusAsync(Guid id, SetResponseStatusDto input)
    {
        var response = await GetWithCommentsAsync(id);
        response.SetStatus(input.Status);
        await _repository.UpdateAsync(response, autoSave: true);
        return ObjectMapper.Map<AppResponse, ResponseDetailDto>(response);
    }

    public async Task<ResponseDetailDto> SetTagsAsync(Guid id, SetResponseTagsDto input)
    {
        var response = await GetWithCommentsAsync(id);
        response.SetTags(input.TagsJson);
        await _repository.UpdateAsync(response, autoSave: true);
        return ObjectMapper.Map<AppResponse, ResponseDetailDto>(response);
    }

    public async Task<ResponseCommentDto> AddCommentAsync(Guid id, AddResponseCommentDto input)
    {
        var response = await GetWithCommentsAsync(id);
        var comment = response.AddComment(GuidGenerator.Create(), input.Text);
        await _repository.UpdateAsync(response, autoSave: true);
        return ObjectMapper.Map<ResponseComment, ResponseCommentDto>(comment);
    }

    public async Task DeleteCommentAsync(Guid id, Guid commentId)
    {
        var response = await GetWithCommentsAsync(id);
        response.RemoveComment(commentId);
        await _repository.UpdateAsync(response, autoSave: true);
    }

    private async Task<AppResponse> GetWithCommentsAsync(Guid id)
    {
        var queryable = await _repository.WithDetailsAsync(r => r.Comments);
        var response = await AsyncExecuter.FirstOrDefaultAsync(queryable.Where(r => r.Id == id));

        if (response is null)
        {
            throw new EntityNotFoundException(typeof(AppResponse), id);
        }

        return response;
    }
}
