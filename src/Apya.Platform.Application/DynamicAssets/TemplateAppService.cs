using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Manages template documents (IsTemplate = true).
/// Templates serve as blueprints that can be instantiated into concrete documents.
/// </summary>
[Authorize]
public class TemplateAppService : PlatformAppService, ITemplateAppService
{
    private readonly IAppDocumentRepository _documentRepository;
    private readonly ILogger<TemplateAppService> _logger;

    public TemplateAppService(
        IAppDocumentRepository documentRepository,
        ILogger<TemplateAppService> logger)
    {
        _documentRepository = documentRepository;
        _logger = logger;
    }

    public async Task<DocumentDto> CreateAsync(CreateTemplateDto input)
    {
        var document = new AppDocument(
            GuidGenerator.Create(),
            input.Title,
            input.Slug,
            isTemplate: true
        );

        foreach (var blockDto in input.Blocks.OrderBy(b => b.Order))
        {
            document.AddBlock(
                GuidGenerator.Create(),
                blockDto.Type,
                blockDto.Order,
                blockDto.Content,
                blockDto.Settings,
                blockDto.AgentContext
            );
        }

        await _documentRepository.InsertAsync(document, autoSave: true);

        _logger.LogInformation(
            "Şablon oluşturuldu. DocumentId: {DocumentId}, Title: {Title}, Slug: {Slug}",
            document.Id, document.Title, document.Slug);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    public async Task<DocumentDto> GetAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);

        if (!document.IsTemplate)
        {
            throw new UserFriendlyException("Bu kayıt bir şablon değildir.");
        }

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    public async Task<PagedResultDto<DocumentDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var queryable = await _documentRepository.GetQueryableAsync();

        queryable = queryable.Where(d => d.IsTemplate);

        var totalCount = queryable.Count();

        var items = queryable
            .OrderByDescending(d => d.CreationTime)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount)
            .ToList();

        var dtos = ObjectMapper.Map<List<AppDocument>, List<DocumentDto>>(items);

        return new PagedResultDto<DocumentDto>(totalCount, dtos);
    }

    public async Task DeleteAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);

        if (!document.IsTemplate)
        {
            throw new UserFriendlyException("Bu kayıt bir şablon değildir.");
        }

        await _documentRepository.DeleteAsync(id);

        _logger.LogInformation(
            "Şablon silindi. DocumentId: {DocumentId}, Title: {Title}",
            document.Id, document.Title);
    }
}
