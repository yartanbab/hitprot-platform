using System;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Web.Hubs;
using Microsoft.AspNetCore.SignalR;
using NSubstitute;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.Hubs;

/// <summary>
/// SÖZLEŞME: canlı kanala yalnız o kanala GİRMİŞ bağlantı sinyal gönderir ve kanal adı kiracıyı taşır.
///
/// <para>Hibe başvuru kanalında abonelik okuma kapısından geçiyordu ama "veri değişti" ve odak
/// sinyalleri hiçbir şeyi denetlemiyordu: oturumu olan herkes, kimliğini bildiği herhangi bir
/// başvurunun açık sihirbazına sinyal gönderebiliyordu. Taslak toplu iş kanalı ise yalnız iş
/// kimliğiyle adlandırıldığı için başka kiracının kullanıcısı o işin durumunu dinleyebiliyordu.</para>
/// </summary>
public class HubChannelGuard_Tests
{
    private readonly IGrantApplicationWizardAppService _wizard = Substitute.For<IGrantApplicationWizardAppService>();
    private readonly IHubCallerClients _clients = Substitute.For<IHubCallerClients>();
    private readonly IGroupManager _groups = Substitute.For<IGroupManager>();

    private static HubCallerContext Connection(string id)
    {
        var context = Substitute.For<HubCallerContext>();
        context.ConnectionId.Returns(id);
        return context;
    }

    private GrantApplicationHub GrantHub(string connectionId)
    {
        var user = Substitute.For<ICurrentUser>();
        user.Id.Returns(Guid.NewGuid());
        user.UserName.Returns("kanal-test");

        var lazy = Substitute.For<IAbpLazyServiceProvider>();
        lazy.LazyGetRequiredService<ICurrentUser>().Returns(user);
        lazy.LazyGetService<ICurrentUser>().Returns(user);

        return new GrantApplicationHub(_wizard)
        {
            Groups = _groups,
            Clients = _clients,
            Context = Connection(connectionId),
            LazyServiceProvider = lazy
        };
    }

    [Fact]
    public async Task Basvuru_kanalina_girmemis_baglanti_sinyal_gonderemez()
    {
        var applicationId = Guid.NewGuid();
        var hub = GrantHub("girmemis-" + Guid.NewGuid());

        await hub.NotifyChanged(applicationId, "ozet");
        await hub.SetFocus(applicationId, "ozet");

        _clients.DidNotReceiveWithAnyArgs().OthersInGroup(default!);
        _clients.DidNotReceiveWithAnyArgs().Group(default!);
    }

    [Fact]
    public async Task Baska_basvuruya_girmis_baglanti_bu_basvuruya_sinyal_gonderemez()
    {
        var own = Guid.NewGuid();
        var other = Guid.NewGuid();
        _wizard.GetAsync(own).Returns(new GrantApplicationWizardDto());
        var hub = GrantHub("baska-" + Guid.NewGuid());
        await hub.Subscribe(own);
        _clients.ClearReceivedCalls();

        await hub.NotifyChanged(other, "ozet");
        await hub.SetFocus(other, "ozet");

        _clients.DidNotReceiveWithAnyArgs().OthersInGroup(default!);
        _clients.DidNotReceiveWithAnyArgs().Group(default!);
    }

    /// <summary>Karşı yön: kanala girmiş bağlantının sinyali karşı tarafa gider.</summary>
    [Fact]
    public async Task Basvuru_kanalina_girmis_baglanti_sinyal_gonderir()
    {
        var applicationId = Guid.NewGuid();
        _wizard.GetAsync(applicationId).Returns(new GrantApplicationWizardDto());
        var hub = GrantHub("girmis-" + Guid.NewGuid());
        await hub.Subscribe(applicationId);

        await hub.NotifyChanged(applicationId, "ozet");

        _clients.Received(1).OthersInGroup($"GrantApplication_{applicationId}");
    }

    /* ═══════════════ Taslak toplu iş kanalı ═══════════════ */

    private AiHub AiHubFor(Guid? tenantId)
    {
        var tenant = Substitute.For<ICurrentTenant>();
        tenant.Id.Returns(tenantId);

        var lazy = Substitute.For<IAbpLazyServiceProvider>();
        lazy.LazyGetRequiredService<ICurrentTenant>().Returns(tenant);
        lazy.LazyGetService<ICurrentTenant>().Returns(tenant);

        return new AiHub { Groups = _groups, Context = Connection("ai-1"), LazyServiceProvider = lazy };
    }

    [Fact]
    public async Task Toplu_is_kanali_kiraciya_baglidir()
    {
        var batchId = Guid.NewGuid();
        var tenantA = Guid.NewGuid();
        var tenantB = Guid.NewGuid();

        await AiHubFor(tenantB).SubscribeToBatchAsync(batchId.ToString());

        // Olay A kiracısının kanalına gider; B kiracısından abone olan o kanalda değildir.
        var eventGroup = AiHub.DraftBatchGroup(tenantA, batchId);
        await _groups.DidNotReceive().AddToGroupAsync("ai-1", eventGroup, Arg.Any<CancellationToken>());
        await _groups.Received(1).AddToGroupAsync(
            "ai-1", AiHub.DraftBatchGroup(tenantB, batchId), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Toplu_is_kanalina_gecersiz_kimlikle_girilmez()
    {
        await AiHubFor(Guid.NewGuid()).SubscribeToBatchAsync("kimlik-degil");

        await _groups.DidNotReceiveWithAnyArgs().AddToGroupAsync(default!, default!, default);
    }
}
