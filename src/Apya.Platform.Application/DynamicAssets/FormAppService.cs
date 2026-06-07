using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Manages forms (non-template AppDocuments) across their full lifecycle:
/// draft → published → archived, plus listing, statistics and CRUD.
/// </summary>
[Authorize(PlatformPermissions.DynamicAssets.Default)]
public class FormAppService : PlatformAppService, IFormAppService
{
    private readonly IAppDocumentRepository _documentRepository;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly ILogger<FormAppService> _logger;

    public FormAppService(
        IAppDocumentRepository documentRepository,
        IRepository<AppResponse, Guid> responseRepository,
        ILogger<FormAppService> logger)
    {
        _documentRepository = documentRepository;
        _responseRepository = responseRepository;
        _logger = logger;
    }

    public async Task<PagedResultDto<FormListItemDto>> GetListAsync(FormListFilterDto input)
    {
        var queryable = await _documentRepository.GetQueryableAsync();

        queryable = queryable.Where(d => !d.IsTemplate);

        if (input.Status.HasValue)
        {
            queryable = queryable.Where(d => d.Status == input.Status.Value);
        }

        if (input.CategoryId.HasValue)
        {
            queryable = queryable.Where(d => d.CategoryId == input.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            var filter = input.Filter.Trim();
            queryable = queryable.Where(d => d.Title.Contains(filter));
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var query = queryable
            .OrderByDescending(d => d.CreationTime)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        var items = await AsyncExecuter.ToListAsync(query);

        return new PagedResultDto<FormListItemDto>(
            totalCount,
            ObjectMapper.Map<List<AppDocument>, List<FormListItemDto>>(items));
    }

    public async Task<DocumentDto> GetAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);
        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Create)]
    public async Task<DocumentDto> CreateAsync(CreateUpdateFormDto input)
    {
        var document = new AppDocument(
            GuidGenerator.Create(),
            input.Title,
            GenerateSlugFromTitle(input.Title),
            isTemplate: false);

        document.SetDescription(input.Description);
        document.SetCategory(input.CategoryId);
        document.SetTheme(input.ThemeJson);

        foreach (var blockDto in input.Blocks.OrderBy(b => b.Order))
        {
            document.AddBlock(
                GuidGenerator.Create(),
                blockDto.Type,
                blockDto.Order,
                blockDto.Content,
                blockDto.Settings,
                blockDto.AgentContext);
        }

        await _documentRepository.InsertAsync(document, autoSave: true);

        _logger.LogInformation("Form oluşturuldu. FormId: {FormId}, Title: {Title}", document.Id, document.Title);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Edit)]
    public async Task<DocumentDto> UpdateAsync(Guid id, CreateUpdateFormDto input)
    {
        var document = await _documentRepository.GetAsync(id);

        document.SetTitle(input.Title);
        document.SetDescription(input.Description);
        document.SetCategory(input.CategoryId);
        document.SetTheme(input.ThemeJson);

        await _documentRepository.UpdateAsync(document, autoSave: true);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Edit)]
    public async Task<DocumentDto> UpdateBlocksAsync(Guid id, UpdateFormBlocksDto input)
    {
        var document = await _documentRepository.GetWithBlocksAsync(id);

        document.ClearBlocks();

        foreach (var blockDto in input.Blocks.OrderBy(b => b.Order))
        {
            document.AddBlock(
                GuidGenerator.Create(),
                blockDto.Type,
                blockDto.Order,
                blockDto.Content,
                blockDto.Settings,
                blockDto.AgentContext);
        }

        await _documentRepository.UpdateAsync(document, autoSave: true);

        _logger.LogInformation(
            "Form blokları güncellendi. FormId: {FormId}, BlockCount: {BlockCount}",
            document.Id, input.Blocks.Count);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _documentRepository.DeleteAsync(id);
        _logger.LogInformation("Form silindi. FormId: {FormId}", id);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Publish)]
    public async Task<DocumentDto> PublishAsync(Guid id, PublishFormDto input)
    {
        var document = await _documentRepository.GetAsync(id);

        if (!string.IsNullOrWhiteSpace(input.Slug))
        {
            document.SetSlug(input.Slug.Trim());
        }

        document.SetPublishSettings(input.PublishSettingsJson);
        document.Publish();

        await _documentRepository.UpdateAsync(document, autoSave: true);

        _logger.LogInformation("Form yayınlandı. FormId: {FormId}, Slug: {Slug}", document.Id, document.Slug);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Publish)]
    public async Task<DocumentDto> ArchiveAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);
        document.Archive();
        await _documentRepository.UpdateAsync(document, autoSave: true);
        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Publish)]
    public async Task<DocumentDto> MoveToDraftAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);
        document.MoveToDraft();
        await _documentRepository.UpdateAsync(document, autoSave: true);
        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.ViewResponses)]
    public async Task<FormStatisticsDto> GetStatisticsAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);

        var responseQueryable = await _responseRepository.GetQueryableAsync();
        responseQueryable = responseQueryable.Where(r => r.DocumentId == id);

        var todayUtc = DateTime.UtcNow.Date;

        var todayCount = await AsyncExecuter.CountAsync(
            responseQueryable.Where(r => r.CreationTime >= todayUtc));

        var pendingCount = await AsyncExecuter.CountAsync(
            responseQueryable.Where(r => r.Status == ResponseStatus.Pending));

        return new FormStatisticsDto
        {
            ViewCount = document.ViewCount,
            ResponseCount = document.ResponseCount,
            TodayResponseCount = todayCount,
            PendingResponseCount = pendingCount
        };
    }

    /// <summary>
    /// Generates a URL-friendly slug from a title with a short unique suffix.
    /// </summary>
    private string GenerateSlugFromTitle(string title)
    {
        var baseSlug = title
            .Trim()
            .ToLowerInvariant()
            .Replace(' ', '-')
            .Replace("ş", "s")
            .Replace("ç", "c")
            .Replace("ğ", "g")
            .Replace("ı", "i")
            .Replace("ö", "o")
            .Replace("ü", "u");

        var suffix = Guid.NewGuid().ToString("N")[..6];
        return $"{baseSlug}-{suffix}";
    }
}
