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
/// Manages instantiated documents (IsTemplate = false).
/// Provides the critical <see cref="InstantiateFromTemplateAsync"/> method
/// for creating concrete documents from template blueprints.
/// </summary>
    [Authorize]
    public class DynamicDocumentAppService : PlatformAppService, IDynamicDocumentAppService
    {
        private readonly IAppDocumentRepository _documentRepository;
        private readonly ILogger<DynamicDocumentAppService> _logger;

        public DynamicDocumentAppService(
            IAppDocumentRepository documentRepository,
            ILogger<DynamicDocumentAppService> logger)
        {
            _documentRepository = documentRepository;
            _logger = logger;
        }

    /// <summary>
    /// Creates a new document by deep-copying all blocks from an existing template.
    /// Steps:
    ///   1. Fetch the template with its blocks via repository.
    ///   2. Validate that it exists and is indeed a template.
    ///   3. Create a new AppDocument referencing the template via ParentTemplateId.
    ///   4. Deep-copy each block into the new document with fresh IDs.
    ///   5. Persist and return the new document as DTO.
    /// </summary>
    public async Task<DocumentDto> InstantiateFromTemplateAsync(InstantiateDocumentDto input)
    {
        // Step 1: Fetch template with blocks
        var template = await _documentRepository.GetAsync(input.TemplateId);

        // Step 2: Validate
        if (!template.IsTemplate)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentBlockNotFound)
                .WithData("TemplateId", input.TemplateId);
        }

        // Step 3: Create new document referencing the template
        var slug = GenerateSlugFromTitle(input.NewTitle);

        var newDocument = new AppDocument(
            GuidGenerator.Create(),
            input.NewTitle,
            slug,
            isTemplate: false,
            parentTemplateId: template.Id
        );

        // Step 4: Deep copy blocks from template
        foreach (var templateBlock in template.Blocks.OrderBy(b => b.Order))
        {
            newDocument.AddBlock(
                GuidGenerator.Create(),
                templateBlock.Type,
                templateBlock.Order,
                templateBlock.Content,
                templateBlock.Settings,
                templateBlock.AgentContext
            );
        }

        // Step 5: Persist
        await _documentRepository.InsertAsync(newDocument, autoSave: true);

        _logger.LogInformation(
            "Şablondan doküman türetildi. NewDocumentId: {NewDocumentId}, TemplateId: {TemplateId}, Title: {Title}",
            newDocument.Id, template.Id, newDocument.Title);

        return ObjectMapper.Map<AppDocument, DocumentDto>(newDocument);
    }

    public async Task<DocumentDto> GetAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);
        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    public async Task<DocumentDto> GetBySlugAsync(string slug)
    {
        var document = await _documentRepository.GetBySlugWithBlocksAsync(slug);

        if (document is null)
        {
            throw new UserFriendlyException("Belirtilen slug ile doküman bulunamadı.");
        }

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    public async Task<PagedResultDto<DocumentDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var queryable = await _documentRepository.GetQueryableAsync();

        queryable = queryable.Where(d => !d.IsTemplate);

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
        await _documentRepository.DeleteAsync(id);

        _logger.LogInformation("Doküman silindi. DocumentId: {DocumentId}", id);
    }

    /// <summary>
    /// Generates a URL-friendly slug from a given title.
    /// Replaces whitespace with hyphens and appends a short unique suffix.
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

        // Append short unique suffix to avoid slug collisions
        var suffix = Guid.NewGuid().ToString("N")[..6];
        return $"{baseSlug}-{suffix}";
    }
}
