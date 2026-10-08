using System;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Hubs;
using Microsoft.AspNetCore.SignalR;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Xunit;

namespace Apya.Platform.Hubs;

/// <summary>
/// SÖZLEŞME: görevin canlı durum kanalına yalnız o görevi OKUYABİLEN bağlanır.
///
/// <para>Abonelik hiçbir şeyi doğrulamıyordu: oturumu olan herkes, kimliğini bildiği herhangi bir
/// görevin — başka kiracının ya da göremediği gizli bir görevin — durum değişikliklerini
/// dinleyebiliyordu. Kapı görev servisinin okuma ucudur (izin + kiracı + gizlilik orada);
/// burada ölçülen, hub'ın o kapıdan GEÇMEDEN gruba eklemediğidir.</para>
/// </summary>
public class TaskHubAccess_Tests
{
    private readonly ITaskAppService _taskAppService = Substitute.For<ITaskAppService>();
    private readonly IGroupManager _groups = Substitute.For<IGroupManager>();

    private TaskHub Hub()
    {
        var context = Substitute.For<HubCallerContext>();
        context.ConnectionId.Returns("baglanti-1");

        return new TaskHub(_taskAppService) { Groups = _groups, Context = context };
    }

    [Fact]
    public async Task Gorevi_okuyamayan_kanala_eklenmez()
    {
        var taskId = Guid.NewGuid();
        _taskAppService.GetAsync(taskId).ThrowsAsync(new EntityNotFoundException(typeof(TaskItem), taskId));

        await Should.ThrowAsync<EntityNotFoundException>(() => Hub().SubscribeToTask(taskId));

        await _groups.DidNotReceiveWithAnyArgs().AddToGroupAsync(default!, default!, default);
    }

    [Fact]
    public async Task Gorevi_okuyabilen_kanala_eklenir()
    {
        var taskId = Guid.NewGuid();
        _taskAppService.GetAsync(taskId).Returns(new TaskDto { Id = taskId });

        await Hub().SubscribeToTask(taskId);

        await _groups.Received(1).AddToGroupAsync("baglanti-1", $"Task_{taskId}", Arg.Any<CancellationToken>());
    }
}
