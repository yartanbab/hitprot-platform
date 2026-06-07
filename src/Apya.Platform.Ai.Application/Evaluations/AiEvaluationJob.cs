using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus.Local;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// Runs a pending evaluation off the request thread: switches into the captured tenant, delegates to
/// <see cref="AiEvaluationManager"/>, and publishes <see cref="AiEvaluationStatusChangedEto"/> on each
/// transition so the Web layer can broadcast live status over SignalR (mirrors PdfTaskExtractionJob).
/// </summary>
public class AiEvaluationJob : AsyncBackgroundJob<AiEvaluationJobArgs>, ITransientDependency
{
    private readonly AiEvaluationManager _evaluationManager;
    private readonly ILocalEventBus _localEventBus;
    private readonly ICurrentTenant _currentTenant;

    public AiEvaluationJob(
        AiEvaluationManager evaluationManager,
        ILocalEventBus localEventBus,
        ICurrentTenant currentTenant)
    {
        _evaluationManager = evaluationManager;
        _localEventBus = localEventBus;
        _currentTenant = currentTenant;
    }

    public override async Task ExecuteAsync(AiEvaluationJobArgs args)
    {
        using (_currentTenant.Change(args.TenantId))
        {
            await PublishAsync(args, AiEvaluationStatus.Processing);

            try
            {
                var evaluation = await _evaluationManager.ProcessAsync(args.EvaluationId);
                var result = evaluation.Result;

                await PublishAsync(
                    args,
                    evaluation.Status,
                    result?.Score,
                    result?.RiskLevel,
                    result?.Decision,
                    evaluation.ErrorMessage);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "AiEvaluationJob hata. EvaluationId: {Id}", args.EvaluationId);
                // ARCH-040: internal error detail must not leak to the browser via SignalR.
                await PublishAsync(args, AiEvaluationStatus.Failed,
                    errorMessage: "Değerlendirme sırasında bir hata oluştu. Lütfen tekrar deneyin.");
                throw;
            }
        }
    }

    private Task PublishAsync(
        AiEvaluationJobArgs args,
        AiEvaluationStatus status,
        int? score = null,
        string? riskLevel = null,
        string? decision = null,
        string? errorMessage = null)
    {
        return _localEventBus.PublishAsync(new AiEvaluationStatusChangedEto
        {
            EvaluationId = args.EvaluationId,
            TenantId = args.TenantId,
            DocumentId = args.DocumentId,
            ResponseId = args.ResponseId,
            NewStatus = status,
            Score = score,
            RiskLevel = riskLevel,
            Decision = decision,
            ErrorMessage = errorMessage
        });
    }
}
