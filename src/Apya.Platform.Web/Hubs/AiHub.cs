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
}
