using Microsoft.AspNetCore.SignalR;
using Volo.Abp.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;

namespace Apya.Platform.Web.Hubs;

/// <summary>
/// Task Collaboration Hub.
/// Allows clients to connect to task-specific groups for realtime updates.
/// </summary>
public class TaskHub : AbpHub
{
    public async Task SubscribeToTask(Guid taskId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Task_{taskId}");
    }

    public async Task UnsubscribeFromTask(Guid taskId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Task_{taskId}");
    }
}
