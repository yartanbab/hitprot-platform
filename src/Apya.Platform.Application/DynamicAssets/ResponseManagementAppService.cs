using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
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
    private readonly IRepository<AppDocument, Guid> _documentRepository;
    private readonly IRepository<Tenant, Guid> _tenantRepository;

    public ResponseManagementAppService(
        IRepository<AppResponse, Guid> repository,
        IRepository<AppDocument, Guid> documentRepository,
        IRepository<Tenant, Guid> tenantRepository)
    {
        _repository = repository;
        _documentRepository = documentRepository;
        _tenantRepository = tenantRepository;
    }

    public async Task<PagedResultDto<ResponseListItemDto>> GetListAsync(ResponseListFilterDto input)
    {
        using var _ = IncludeTenantResponsesForHost();
        var queryable = await OnlyReadableAsync(await _repository.GetQueryableAsync());

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

        var dtos = ObjectMapper.Map<List<AppResponse>, List<ResponseListItemDto>>(items);
        var tenantNames = await TenantNamesAsync(items.Select(r => r.TenantId));
        for (var i = 0; i < items.Count; i++)
        {
            dtos[i].TenantName = TenantNameOf(tenantNames, items[i].TenantId);
        }

        return new PagedResultDto<ResponseListItemDto>(totalCount, dtos);
    }

    public async Task<ResponseDetailDto> GetAsync(Guid id)
    {
        var response = await GetWithCommentsAsync(id);
        var dto = ObjectMapper.Map<AppResponse, ResponseDetailDto>(response);
        dto.TenantName = TenantNameOf(await TenantNamesAsync(new[] { response.TenantId }), response.TenantId);
        return dto;
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
        AppResponse? response;
        using (IncludeTenantResponsesForHost())
        {
            var queryable = await OnlyReadableAsync(await _repository.WithDetailsAsync(r => r.Comments));
            response = await AsyncExecuter.FirstOrDefaultAsync(queryable.Where(r => r.Id == id));
        }

        if (response is null)
        {
            throw new EntityNotFoundException(typeof(AppResponse), id);
        }

        return response;
    }

    /// <summary>
    /// Host formunu dolduran kiracının yanıtı o kiracıya yazılır (<see cref="PublicFormLocator"/>). Host kendi
    /// formlarının yanıtlarını bu yüzden kiracı süzgeci kapalı okur. Kiracı bağlamında davranış değişmez.
    /// </summary>
    private IDisposable IncludeTenantResponsesForHost()
        => CurrentTenant.Id is null ? DataFilter.Disable<IMultiTenant>() : NullDisposable.Instance;

    /// <summary>
    /// Süzgeç kapalıyken host'un okuması yalnız HOST formlarının yanıtlarına daraltılır; kiracı formlarının
    /// yanıtları host'a açılmaz.
    /// </summary>
    private async Task<IQueryable<AppResponse>> OnlyReadableAsync(IQueryable<AppResponse> queryable)
    {
        if (CurrentTenant.Id is not null)
        {
            return queryable;
        }

        var documents = await _documentRepository.GetQueryableAsync();
        return queryable.Where(r => documents.Any(d => d.Id == r.DocumentId && d.TenantId == null));
    }

    /// <summary>Host listesinde yanıtı hangi firmanın verdiği; kiracı kendi yanıtlarında adı görmez.</summary>
    private async Task<Dictionary<Guid, string>> TenantNamesAsync(IEnumerable<Guid?> tenantIds)
    {
        var ids = tenantIds.Where(t => t.HasValue).Select(t => t!.Value).Distinct().ToList();
        if (CurrentTenant.Id is not null || ids.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        return (await _tenantRepository.GetListAsync(t => ids.Contains(t.Id))).ToDictionary(t => t.Id, t => t.Name);
    }

    private static string? TenantNameOf(Dictionary<Guid, string> names, Guid? tenantId)
        => tenantId.HasValue && names.TryGetValue(tenantId.Value, out var name) ? name : null;
}
