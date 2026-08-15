using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Consents;
using Apya.Platform.Consents.Dtos;
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
    private readonly IConsentAppService _consentAppService;
    private readonly ILogger<ResponseAppService> _logger;

    public ResponseAppService(
        IAppDocumentRepository documentRepository,
        IRepository<AppResponse, Guid> responseRepository,
        IConsentAppService consentAppService,
        ILogger<ResponseAppService> logger)
    {
        _documentRepository = documentRepository;
        _responseRepository = responseRepository;
        _consentAppService = consentAppService;
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

        // Yayın ayarlarını uygula (önceden kaydediliyor ama HİÇ uygulanmıyordu).
        var settings = FormPublishSettings.Parse(document.PublishSettingsJson);

        // 1) Yayın penceresi (GetBySlug'da da kontrol edilir; burası defense-in-depth).
        var windowViolation = settings.WindowViolation(Clock.Now);
        if (windowViolation != null)
        {
            throw new BusinessException(windowViolation);
        }

        // 2) Bot koruması: honeypot (insan boş bırakır) + minimum doldurma süresi.
        if (settings.Captcha)
        {
            var honeypotTripped = !string.IsNullOrWhiteSpace(input.Website);
            var tooFast = input.CompletionSeconds is >= 0 and < 2;
            if (honeypotTripped || tooFast)
            {
                _logger.LogWarning(
                    "Form bot koruması reddetti. Slug: {Slug}, honeypot: {Honeypot}, süre: {Seconds}s",
                    input.DocumentSlug, honeypotTripped, input.CompletionSeconds);
                throw new BusinessException(PlatformDomainErrorCodes.FormCaptchaFailed);
            }
        }

        // 3) KVKK aydınlatma onayı zorunluysa işaretlenmiş olmalı.
        if (settings.Kvkk && !input.KvkkConsent)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FormKvkkConsentRequired);
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

        // KVKK onayı istenmişse rıza kaydını ortak omurgaya yaz (hukuki delil).
        if (settings.Kvkk && input.KvkkConsent)
        {
            await _consentAppService.RecordAsync(new RecordConsentInput
            {
                Type = ConsentType.FormKvkk,
                Granted = true,
                SubjectKind = CurrentUser.Id.HasValue ? ConsentSubjectKind.User : ConsentSubjectKind.Anonymous,
                SubjectId = CurrentUser.Id?.ToString(),
                SourceRef = input.DocumentSlug
            });
        }

        // Increment the form's response counter (best-effort).
        document.IncrementResponseCount();
        await _documentRepository.UpdateAsync(document, autoSave: true);

        _logger.LogInformation(
            "Form yanıtı kaydedildi. ResponseId: {ResponseId}, DocumentId: {DocumentId}, Slug: {Slug}",
            response.Id, document.Id, input.DocumentSlug);
    }
}
