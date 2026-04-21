using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Apya.Platform.Tasks;
using Microsoft.Extensions.Logging;

namespace Apya.Platform.Web.Hubs;

/// <summary>
/// Listens to Domain/Application events and broadcasts them via SignalR WebSockets.
/// This strictly follows DDD avoiding UI logic (SignalR) inside the Application layer.
/// </summary>
public class TaskRealTimeEventHandler : ILocalEventHandler<TaskStatusChangedEto>, ITransientDependency
{
    private readonly IHubContext<TaskHub> _taskHubContext;
    private readonly ILogger<TaskRealTimeEventHandler> _logger;

    public TaskRealTimeEventHandler(
        IHubContext<TaskHub> taskHubContext,
        ILogger<TaskRealTimeEventHandler> logger)
    {
        _taskHubContext = taskHubContext;
        _logger = logger;
    }

    public async Task HandleEventAsync(TaskStatusChangedEto eventData)
    {
        _logger.LogInformation("Realtime yayın: Görev statü değişimi ({TaskId} -> {NewStatus})", eventData.TaskId, eventData.NewStatus);

        // Notify only the users who are looking at this specific task (or board)
        var targetGroup = $"Task_{eventData.TaskId}";
        
        await _taskHubContext.Clients.Group(targetGroup).SendAsync(
            "ReceiveTaskStatusUpdate", 
            eventData.TaskId, 
            eventData.NewStatus.ToString());
        // TODO: Proje bazlı yayın istenirse TaskStatusChangedEto içerisine ProjectId eklenmelidir.
    }
}
