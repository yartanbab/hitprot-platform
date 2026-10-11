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
        if (System.Guid.TryParse(batchId, out var id))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, DraftBatchGroup(CurrentTenant.Id, id));
        }
    }

    public async Task UnsubscribeFromBatchAsync(string batchId)
    {
        if (System.Guid.TryParse(batchId, out var id))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, DraftBatchGroup(CurrentTenant.Id, id));
        }
    }

    /// <summary>
    /// Kanal adı kiracıyı da taşır. Yalnız toplu iş kimliğiyle kurulduğunda, kimliği bilen başka bir
    /// kiracının kullanıcısı o işin durumunu ve hata iletisini dinleyebiliyordu.
    /// </summary>
    public static string DraftBatchGroup(System.Guid? tenantId, System.Guid batchId)
        => $"DraftBatch_{(tenantId?.ToString() ?? "host")}_{batchId}";

    /// <summary>
    /// Client joins its tenant's evaluations group to receive live status updates.
    /// Tenant-scoped so evaluation data is never broadcast across tenants.
    /// </summary>
    public Task SubscribeToEvaluationsAsync()
        => Groups.AddToGroupAsync(Context.ConnectionId, EvaluationsGroup(CurrentTenant.Id));

    public static string EvaluationsGroup(System.Guid? tenantId)
        => $"AiEvaluations_{(tenantId?.ToString() ?? "host")}";
}
