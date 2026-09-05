using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
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
    private readonly Apya.Platform.Tasks.ITaskShareAppService _taskShareAppService;

    public ResponseAppService(
        IAppDocumentRepository documentRepository,
        IRepository<AppResponse, Guid> responseRepository,
        IConsentAppService consentAppService,
        ILogger<ResponseAppService> logger,
        Apya.Platform.Tasks.ITaskShareAppService taskShareAppService)
    {
        _documentRepository = documentRepository;
        _responseRepository = responseRepository;
        _consentAppService = consentAppService;
        _logger = logger;
        _taskShareAppService = taskShareAppService;
    }

    public async Task SubmitAsync(SubmitResponseDto input)
    {
        // Görev bağlamı iddiası varsa ÖNCE doğrulanır: token geçerli mi, görev
        // linkin kapsamında mı, form o göreve bağlı ve misafire AÇIK mı. Doğrulama
        // düşerse gönderim hiç başlamaz.
        var tokenVar = !string.IsNullOrWhiteSpace(input.TaskShareToken);
        if (tokenVar != input.TaskId.HasValue)
        {
            // Yarım bağlam sessizce anonim gönderime düşmesin: token'ı olup görevi
            // olmayan istek, yanıtı damgalamadan kaydederdi.
            throw new BusinessException(PlatformDomainErrorCodes.FormNotPublished);
        }

        if (!tokenVar)
        {
            await SubmitCoreAsync(input, null);
            return;
        }

        var guest = await _taskShareAppService.ResolveGuestFormAsync(
            input.TaskShareToken!, input.TaskId!.Value, input.DocumentSlug);

        // 🔴 Anonim istekte geçerli kiracı YOKTUR. Gövdedeki her okuma/yazma
        // (form arama, yanıt kaydı, KVKK rıza kaydı) token'ın işaret ettiği
        // kiracıda yürümeli — aksi halde kayıtlar host'a düşerdi.
        using (CurrentTenant.Change(guest.TenantId))
        {
            await SubmitCoreAsync(input, guest);
        }
    }

    private async Task SubmitCoreAsync(SubmitResponseDto input, Apya.Platform.Tasks.GuestFormContextDto? guest)
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

        // 4) Cevap doğrulama (SEC-003): serbest JSON'la çöp/spam veriyi engelle.
        ValidateAnswers(input.Answers, document, input.DocumentSlug);

        // Create a new response entity (status defaults to Pending)
        var response = new AppResponse(
            GuidGenerator.Create(),
            document.Id,
            input.Answers,
            respondentId: CurrentUser.Id,
            completionSeconds: input.CompletionSeconds
        );

        // Görev bağlamı doğrulanmışsa yanıt o göreve (ve linke) damgalanır;
        // görevin Form sekmesi yanıtları bununla süzer.
        if (guest != null)
        {
            response.AttachToTask(guest.TaskId, guest.ShareLinkId);
        }

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

    // Yalnız görsel (cevaplanamayan) blok tipleri — public-form.jsx'teki LAYOUT_ONLY ile aynı küme.
    private static readonly BlockType[] LayoutOnlyBlockTypes = { BlockType.SectionHeader, BlockType.Paragraph };

    private const int MaxAnswersLength = 1_048_576; // 1 MB — imza/uzun metin dahil makul üst sınır

    /// <summary>
    /// SEC-003: Anonim gönderimde <paramref name="answersJson"/>'ı formun bloklarına göre doğrular —
    /// boyut sınırı, geçerli JSON nesnesi, yalnız var olan cevaplanabilir bloklara ait anahtarlar ve
    /// zorunlu blokların doldurulması. Serbest JSON'la çöp/spam/geçersiz veri girişini engeller.
    /// </summary>
    private void ValidateAnswers(string answersJson, AppDocument document, string slug)
    {
        if (string.IsNullOrEmpty(answersJson) || answersJson.Length > MaxAnswersLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FormAnswersTooLarge);
        }

        var answerableBlocks = document.Blocks
            .Where(b => !LayoutOnlyBlockTypes.Contains(b.Type))
            .ToList();
        var answerableIds = answerableBlocks.Select(b => b.Id).ToHashSet();

        var answersByBlock = new Dictionary<Guid, JsonElement>();
        try
        {
            using var parsed = JsonDocument.Parse(answersJson);
            if (parsed.RootElement.ValueKind != JsonValueKind.Object)
            {
                throw new BusinessException(PlatformDomainErrorCodes.FormAnswersInvalid);
            }

            foreach (var prop in parsed.RootElement.EnumerateObject())
            {
                // Her anahtar var olan cevaplanabilir bir bloğa ait olmalı (aksi = tampere/çöp).
                if (!Guid.TryParse(prop.Name, out var blockId) || !answerableIds.Contains(blockId))
                {
                    _logger.LogWarning("Form yanıtında bilinmeyen alan anahtarı reddedildi. Slug: {Slug}, Key: {Key}",
                        slug, prop.Name);
                    throw new BusinessException(PlatformDomainErrorCodes.FormAnswersInvalid);
                }
                answersByBlock[blockId] = prop.Value.Clone();
            }
        }
        catch (JsonException)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FormAnswersInvalid);
        }

        // Zorunlu bloklar boş bırakılamaz (sunucu-taraflı savunma; istemci de kontrol ediyor).
        foreach (var block in answerableBlocks)
        {
            if (IsRequired(block)
                && (!answersByBlock.TryGetValue(block.Id, out var value) || IsEmptyAnswer(value)))
            {
                throw new BusinessException(PlatformDomainErrorCodes.FormRequiredAnswerMissing);
            }
        }
    }

    private static bool IsRequired(AppBlock block)
    {
        if (string.IsNullOrWhiteSpace(block.Settings))
        {
            return false;
        }

        try
        {
            using var doc = JsonDocument.Parse(block.Settings);
            return doc.RootElement.ValueKind == JsonValueKind.Object
                && doc.RootElement.TryGetProperty("required", out var req)
                && req.ValueKind == JsonValueKind.True;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    private static bool IsEmptyAnswer(JsonElement value) => value.ValueKind switch
    {
        JsonValueKind.Null      => true,
        JsonValueKind.Undefined => true,
        JsonValueKind.String    => string.IsNullOrWhiteSpace(value.GetString()),
        JsonValueKind.Array     => value.GetArrayLength() == 0,
        _                       => false
    };
}
