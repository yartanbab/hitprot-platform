using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
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

        return ObjectMapper.Map<AppDocument, PublicDocumentDto>(document);
    }
}
