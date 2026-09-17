using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Public-facing application service for anonymous form retrieval.
/// Uses <see cref="IAppDocumentRepository"/> to fetch documents by slug
/// with eager-loaded blocks, then maps to a minimal public DTO.
/// </summary>
[AllowAnonymous]
public class PublicDocumentAppService : PlatformAppService, IPublicDocumentAppService
{
    private readonly IAppDocumentRepository _documentRepository;
    private readonly PublicFormLocator _formLocator;
    private readonly FormChoiceProvider _choiceProvider;

    public PublicDocumentAppService(
        IAppDocumentRepository documentRepository,
        PublicFormLocator formLocator,
        FormChoiceProvider choiceProvider)
    {
        _documentRepository = documentRepository;
        _formLocator = formLocator;
        _choiceProvider = choiceProvider;
    }

    public async Task<PublicDocumentDto> GetBySlugAsync(string slug, Guid? tenantId = null)
    {
        var document = (await _formLocator.FindAsync(slug, tenantId))?.Document;

        if (document is null)
        {
            throw new EntityNotFoundException(typeof(AppDocument), slug);
        }

        // Only published forms are publicly accessible. Drafts/archived are hidden.
        if (document.Status != FormStatus.Published)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FormNotPublished);
        }

        // Yayın penceresi: başlangıç/bitiş tarihi geçmişse form kapalı (önceden UYGULANMIYORDU).
        var settings = FormPublishSettings.Parse(document.PublishSettingsJson);
        var windowViolation = settings.WindowViolation(Clock.Now);
        if (windowViolation != null)
        {
            throw new BusinessException(windowViolation);
        }

        // Best-effort view counter (analytics). Failure must not block rendering.
        try
        {
            document.IncrementViewCount();
            await _documentRepository.UpdateAsync(document, autoSave: true);
        }
        catch (AbpDbConcurrencyException)
        {
            // Concurrent views can collide on the concurrency stamp; ignore.
        }

        var dto = ObjectMapper.Map<AppDocument, PublicDocumentDto>(document);
        dto.RequireKvkk = settings.Kvkk;
        dto.RequireCaptcha = settings.Captcha;

        // Canlı listeye bağlı açılır listelerin seçenekleri her açılışta güncel veriden gelir. Zincirli alan
        // (16b) burada doldurulmaz: listesi üst alandaki seçime bağlı, istemci seçim yapılınca ister.
        foreach (var block in dto.Blocks)
        {
            block.DependsOnBlockId = FormChoiceProvider.DependsOnBlockOf(block.Type, block.Settings);
            block.Choices = block.DependsOnBlockId == null
                ? await _choiceProvider.GetChoicesAsync(FormChoiceProvider.SourceOf(block.Type, block.Settings))
                : new List<FormChoiceDto>();
        }

        return dto;
    }

    public async Task<List<FormChoiceDto>> GetBlockChoicesAsync(
        string slug, Guid blockId, string? parentValue = null, Guid? tenantId = null)
    {
        var document = (await _formLocator.FindAsync(slug, tenantId))?.Document;
        if (document is null || document.Status != FormStatus.Published)
        {
            throw new EntityNotFoundException(typeof(AppDocument), slug);
        }

        // Yalnız bu formun kendi alanı sorulabilir: blok kimliği başka formdan geliyorsa istek boşa düşer.
        var block = document.Blocks.FirstOrDefault(b => b.Id == blockId);
        var source = block == null ? null : FormChoiceProvider.SourceOf(block.Type, block.Settings);

        return await _choiceProvider.GetChoicesAsync(source, parentValue) ?? new List<FormChoiceDto>();
    }
}
