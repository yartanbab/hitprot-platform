using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Apya.Platform.Ai.Evaluations;

namespace Apya.Platform.Web.Hubs;

/// <summary>
/// Listens to AI evaluation status changes and broadcasts them to the tenant's evaluations group
/// via SignalR. Keeps SignalR concerns out of the Application layer (mirrors AiRealTimeEventHandler).
/// </summary>
public class AiEvaluationRealTimeEventHandler
    : ILocalEventHandler<AiEvaluationStatusChangedEto>,
      ITransientDependency
{
    private readonly IHubContext<AiHub> _aiHubContext;
    private readonly ILogger<AiEvaluationRealTimeEventHandler> _logger;

    public AiEvaluationRealTimeEventHandler(
        IHubContext<AiHub> aiHubContext,
        ILogger<AiEvaluationRealTimeEventHandler> logger)
    {
        _aiHubContext = aiHubContext;
        _logger = logger;
    }

    public async Task HandleEventAsync(AiEvaluationStatusChangedEto eventData)
    {
        _logger.LogInformation(
            "AI realtime: Evaluation {EvaluationId} -> {Status}", eventData.EvaluationId, eventData.NewStatus);

        await _aiHubContext.Clients
            .Group(AiHub.EvaluationsGroup(eventData.TenantId))
            .SendAsync("ReceiveEvaluationUpdate", new
            {
                evaluationId = eventData.EvaluationId,
                documentId = eventData.DocumentId,
                responseId = eventData.ResponseId,
                status = eventData.NewStatus.ToString(),
                score = eventData.Score,
                riskLevel = eventData.RiskLevel,
                decision = eventData.Decision,
                errorMessage = eventData.ErrorMessage
            });
    }
}
