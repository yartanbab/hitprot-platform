using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Volo.Abp.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Hubs;

/// <summary>
/// Task Collaboration Hub.
/// Allows clients to connect to task-specific groups for realtime updates.
///
/// <para>Katılım <see cref="ITaskAppService.GetAsync"/> ile doğrulanır — izin, kiracı sınırı ve
/// gizli görev kuralı orada; hub kendi kuralını yazmaz (<see cref="GrantApplicationHub"/> ile aynı
/// desen). Doğrulama yokken oturumu olan herkes, kimliğini bildiği HERHANGİ bir görevin — başka
/// kiracının ya da göremediği gizli bir görevin — durum değişikliklerini dinleyebiliyordu.</para>
/// </summary>
[Authorize]
public class TaskHub : AbpHub
{
    private readonly ITaskAppService _taskAppService;

    public TaskHub(ITaskAppService taskAppService)
    {
        _taskAppService = taskAppService;
    }

    public async Task SubscribeToTask(Guid taskId)
    {
        // Erişim hakkı olmayan kullanıcı gruba giremez: okuma burada patlar.
        await _taskAppService.GetAsync(taskId);

        await Groups.AddToGroupAsync(Context.ConnectionId, $"Task_{taskId}");
    }

    public async Task UnsubscribeFromTask(Guid taskId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Task_{taskId}");
    }
}
