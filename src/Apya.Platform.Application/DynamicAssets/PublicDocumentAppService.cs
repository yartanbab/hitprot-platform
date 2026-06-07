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

    public PublicDocumentAppService(IAppDocumentRepository documentRepository)
    {
        _documentRepository = documentRepository;
    }

    public async Task<PublicDocumentDto> GetBySlugAsync(string slug)
    {
        var document = await _documentRepository.GetBySlugWithBlocksAsync(slug);

        if (document is null)
        {
            throw new EntityNotFoundException(typeof(AppDocument), slug);
        }

        // Only published forms are publicly accessible. Drafts/archived are hidden.
        if (document.Status != FormStatus.Published)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FormNotPublished);
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

        return ObjectMapper.Map<AppDocument, PublicDocumentDto>(document);
    }
}
