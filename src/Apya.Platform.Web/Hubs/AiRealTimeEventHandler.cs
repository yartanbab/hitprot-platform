using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Apya.Platform.Ai.Drafts;

namespace Apya.Platform.Web.Hubs;

/// <summary>
/// Listens to AI draft batch status changes and broadcasts them via SignalR.
/// Keeps SignalR concerns out of the Application layer (DDD).
/// </summary>
public class AiRealTimeEventHandler : ILocalEventHandler<DraftBatchStatusChangedEto>, ITransientDependency
{
    private readonly IHubContext<AiHub> _aiHubContext;
    private readonly ILogger<AiRealTimeEventHandler> _logger;

    public AiRealTimeEventHandler(
        IHubContext<AiHub> aiHubContext,
        ILogger<AiRealTimeEventHandler> logger)
    {
        _aiHubContext = aiHubContext;
        _logger = logger;
    }

    public async Task HandleEventAsync(DraftBatchStatusChangedEto eventData)
    {
        _logger.LogInformation(
            "AI realtime: DraftBatch {BatchId} → {Status} ({Approved}/{Total})",
            eventData.BatchId, eventData.NewStatus, eventData.ApprovedItems, eventData.TotalItems);

        var targetGroup = $"DraftBatch_{eventData.BatchId}";

        await _aiHubContext.Clients.Group(targetGroup).SendAsync(
            "ReceiveDraftBatchUpdate",
            new
            {
                batchId = eventData.BatchId,
                status = eventData.NewStatus.ToString(),
                totalItems = eventData.TotalItems,
                approvedItems = eventData.ApprovedItems,
                errorMessage = eventData.ErrorMessage
            });
    }
}
