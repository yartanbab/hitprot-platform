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

        // Reject submissions to forms that are not currently published.
        if (document.Status != FormStatus.Published)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FormNotPublished);
        }

        // Create a new response entity (status defaults to Pending)
        var response = new AppResponse(
            GuidGenerator.Create(),
            document.Id,
            input.Answers,
            respondentId: CurrentUser.Id,
            completionSeconds: input.CompletionSeconds
        );

        await _responseRepository.InsertAsync(response, autoSave: true);

        // Increment the form's response counter (best-effort).
        document.IncrementResponseCount();
        await _documentRepository.UpdateAsync(document, autoSave: true);

        _logger.LogInformation(
            "Form yanıtı kaydedildi. ResponseId: {ResponseId}, DocumentId: {DocumentId}, Slug: {Slug}",
            response.Id, document.Id, input.DocumentSlug);
    }
}
