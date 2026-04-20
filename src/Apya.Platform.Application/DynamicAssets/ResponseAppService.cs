using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Handles anonymous response submissions for published documents.
/// Locates the target document by slug, creates an <see cref="AppResponse"/> entity,
/// and persists it to the database.
/// </summary>
[AllowAnonymous]
public class ResponseAppService : PlatformAppService, IResponseAppService
{
    private readonly IAppDocumentRepository _documentRepository;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly ILogger<ResponseAppService> _logger;

    public ResponseAppService(
        IAppDocumentRepository documentRepository,
        IRepository<AppResponse, Guid> responseRepository,
        ILogger<ResponseAppService> logger)
    {
        _documentRepository = documentRepository;
        _responseRepository = responseRepository;
        _logger = logger;
    }

    public async Task SubmitAsync(SubmitResponseDto input)
    {
        // Find the document by slug
        var document = await _documentRepository.GetBySlugWithBlocksAsync(input.DocumentSlug);

        if (document is null)
        {
            throw new EntityNotFoundException(typeof(AppDocument), input.DocumentSlug);
        }

        // Create a new response entity
        var response = new AppResponse(
            GuidGenerator.Create(),
            document.Id,
            input.Answers
        );

        await _responseRepository.InsertAsync(response, autoSave: true);

        _logger.LogInformation(
            "Form yanıtı kaydedildi. ResponseId: {ResponseId}, DocumentId: {DocumentId}, Slug: {Slug}",
            response.Id, document.Id, input.DocumentSlug);
    }
}
