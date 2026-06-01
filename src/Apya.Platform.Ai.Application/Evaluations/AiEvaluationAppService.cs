using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Evaluations.Dtos;
using Apya.Platform.Ai.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Ai.Evaluations;

[Authorize(AiPermissions.Evaluations.Default)]
public class AiEvaluationAppService : ApplicationService, IAiEvaluationAppService
{
    private readonly IAiEvaluationRepository _evaluationRepository;
    private readonly IBackgroundJobManager _backgroundJobManager;

    public AiEvaluationAppService(
        IAiEvaluationRepository evaluationRepository,
        IBackgroundJobManager backgroundJobManager)
    {
        _evaluationRepository = evaluationRepository;
        _backgroundJobManager = backgroundJobManager;
    }

    [Authorize(AiPermissions.Evaluations.View)]
    public async Task<PagedResultDto<AiEvaluationDto>> GetListAsync(GetEvaluationsInput input)
    {
        var totalCount = await _evaluationRepository.GetCountAsync(input.DocumentId, input.Status);
        var items = await _evaluationRepository.GetListWithResultAsync(
            input.DocumentId, input.Status, input.SkipCount, input.MaxResultCount);

        return new PagedResultDto<AiEvaluationDto>(totalCount, items.Select(MapToDto).ToList());
    }

    [Authorize(AiPermissions.Evaluations.View)]
    public async Task<AiEvaluationDetailDto> GetAsync(Guid id)
    {
        var evaluation = await _evaluationRepository.GetWithResultAsync(id)
            ?? throw new EntityNotFoundException(typeof(AiEvaluation), id);

        return MapToDetail(evaluation);
    }

    [Authorize(AiPermissions.Evaluations.Retry)]
    public async Task RetryAsync(Guid id)
    {
        var evaluation = await _evaluationRepository.GetWithResultAsync(id)
            ?? throw new EntityNotFoundException(typeof(AiEvaluation), id);

        if (evaluation.Status != AiEvaluationStatus.Failed)
            throw new UserFriendlyException("Yalnızca başarısız değerlendirmeler yeniden çalıştırılabilir.");

        await _backgroundJobManager.EnqueueAsync(new AiEvaluationJobArgs
        {
            TenantId = CurrentTenant.Id,
            UserId = CurrentUser.Id,
            EvaluationId = evaluation.Id,
            ResponseId = evaluation.ResponseId,
            DocumentId = evaluation.DocumentId,
            PromptId = evaluation.PromptId,
            PromptVersionId = evaluation.PromptVersionId
        });
    }

    private static AiEvaluationDto MapToDto(AiEvaluation e) => new()
    {
        Id = e.Id,
        DocumentId = e.DocumentId,
        ResponseId = e.ResponseId,
        PromptId = e.PromptId,
        PromptVersionId = e.PromptVersionId,
        Status = e.Status,
        IsSchemaValid = e.Result?.IsSchemaValid,
        Score = e.Result?.Score,
        RiskLevel = e.Result?.RiskLevel,
        Decision = e.Result?.Decision,
        CreationTime = e.CreationTime
    };

    private static AiEvaluationDetailDto MapToDetail(AiEvaluation e) => new()
    {
        Id = e.Id,
        DocumentId = e.DocumentId,
        ResponseId = e.ResponseId,
        PromptId = e.PromptId,
        PromptVersionId = e.PromptVersionId,
        Status = e.Status,
        IsSchemaValid = e.Result?.IsSchemaValid,
        Score = e.Result?.Score,
        RiskLevel = e.Result?.RiskLevel,
        Decision = e.Result?.Decision,
        CreationTime = e.CreationTime,
        RawJson = e.Result?.RawJson,
        Summary = e.Result?.Summary,
        TokensUsed = e.Result?.TokensUsed,
        DurationMs = e.Result?.DurationMs,
        ErrorMessage = e.ErrorMessage,
        AiRequestId = e.AiRequestId
    };
}
