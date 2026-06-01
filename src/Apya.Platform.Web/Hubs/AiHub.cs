using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.AspNetCore.SignalR;

namespace Apya.Platform.Web.Hubs;

[Authorize]
public class AiHub : AbpHub
{
    /// <summary>
    /// Client subscribes to a specific batch group to receive status updates.
    /// </summary>
    public async Task SubscribeToBatchAsync(string batchId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"DraftBatch_{batchId}");
    }

    public async Task UnsubscribeFromBatchAsync(string batchId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"DraftBatch_{batchId}");
    }

    /// <summary>
    /// Client joins its tenant's evaluations group to receive live status updates.
    /// Tenant-scoped so evaluation data is never broadcast across tenants.
    /// </summary>
    public Task SubscribeToEvaluationsAsync()
        => Groups.AddToGroupAsync(Context.ConnectionId, EvaluationsGroup(CurrentTenant.Id));

    public static string EvaluationsGroup(System.Guid? tenantId)
        => $"AiEvaluations_{(tenantId?.ToString() ?? "host")}";
}
