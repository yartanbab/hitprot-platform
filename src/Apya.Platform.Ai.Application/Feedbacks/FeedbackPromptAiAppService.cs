using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Security;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;

namespace Apya.Platform.Ai.Feedbacks;

/// <summary>
/// Geri bildirim prompt'u için yapay zekâ ön analizi. Kayıt, geri bildirim yönetim servisinden
/// okunur (host denetimi ve geri bildirim izni orada); bu servis ayrıca AI izni ister.
/// </summary>
[Authorize(AiPermissions.Generation.Default)]
public class FeedbackPromptAiAppService : ApplicationService, IFeedbackPromptAiAppService
{
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;
    private readonly ISystemHealthAppService _systemHealthAppService;
    private readonly IPromptInjectionSanitizer _sanitizer;
    private readonly FeedbackPromptAiManager _feedbackPromptAiManager;

    public FeedbackPromptAiAppService(
        IFeedbackAdminAppService feedbackAdminAppService,
        ISystemHealthAppService systemHealthAppService,
        IPromptInjectionSanitizer sanitizer,
        FeedbackPromptAiManager feedbackPromptAiManager)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
        _systemHealthAppService = systemHealthAppService;
        _sanitizer = sanitizer;
        _feedbackPromptAiManager = feedbackPromptAiManager;
    }

    public async Task<FeedbackPromptAnalysisDto> AnalyzeAsync(Guid id, bool includeInternalNotes)
    {
        var feedback = await _feedbackAdminAppService.GetAsync(id);
        var clientError = await FindLastClientErrorAsync(feedback.LastClientErrorId);

        var data = FeedbackPromptAiData.Build(feedback, clientError, includeInternalNotes, _sanitizer.Sanitize);

        return new FeedbackPromptAnalysisDto
        {
            Analysis = await _feedbackPromptAiManager.AnalyzeAsync(id, data)
        };
    }

    /// <summary>Tekli prompt'taki kuralın aynısı: Sistem Sağlığı izni olmayana hata hiç sorgulanmaz.</summary>
    private async Task<ClientErrorDto?> FindLastClientErrorAsync(Guid? clientErrorId)
    {
        if (clientErrorId is null
            || !await AuthorizationService.IsGrantedAsync(PlatformPermissions.SystemHealth.Default))
        {
            return null;
        }

        try
        {
            return await _systemHealthAppService.GetClientErrorAsync(clientErrorId.Value);
        }
        catch (EntityNotFoundException)
        {
            return null;
        }
    }
}
