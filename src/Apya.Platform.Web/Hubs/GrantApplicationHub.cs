using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Volo.Abp.AspNetCore.SignalR;
using Volo.Abp.Users;
using Apya.Platform.Grants;

namespace Apya.Platform.Web.Hubs;

/// <summary>
/// 2a · Başvuru sihirbazının canlı kanalı: kim formda, hangi alanda ve bir şey
/// değiştiğinde karşı tarafın haberi.
///
/// <para>VERİ TAŞIMAZ. İstemci "değişti" sinyali alır ve veriyi AppService'ten
/// yeniden okur. Alan değerlerini hub üzerinden yayınlasaydık istemciden gelen
/// yükü doğrulamak zorunda kalırdık; kural zaten uygulama katmanında.</para>
///
/// <para>Katılım <see cref="IGrantApplicationWizardAppService.GetAsync"/> ile
/// doğrulanır — izin ve kiracı sınırı orada; hub kendi kuralını yazmaz.</para>
///
/// <para>🔴 Varlık bilgisi (presence) PROCESS BELLEĞİNDE. Tek sunucuda doğrudur;
/// ölçeklenirse Redis backplane gerekir. Kilitler DB'de olduğu için ölçekte
/// bozulan tek şey "şu an formda" listesidir, veri bütünlüğü değil.</para>
/// </summary>
[Authorize]
public class GrantApplicationHub : AbpHub
{
    private static readonly ConcurrentDictionary<string, PresenceEntry> Presence = new();

    private readonly IGrantApplicationWizardAppService _wizard;

    public GrantApplicationHub(IGrantApplicationWizardAppService wizard)
    {
        _wizard = wizard;
    }

    private sealed record PresenceEntry(
        Guid ApplicationId, Guid UserId, string Name, GrantPartyRole Role, string? FieldKey);

    private static string GroupOf(Guid applicationId) => $"GrantApplication_{applicationId}";

    public async Task Subscribe(Guid applicationId)
    {
        // Erişim hakkı olmayan kullanıcı gruba giremez: okuma burada patlar.
        var dto = await _wizard.GetAsync(applicationId);

        await Groups.AddToGroupAsync(Context.ConnectionId, GroupOf(applicationId));
        Presence[Context.ConnectionId] = new PresenceEntry(
            applicationId,
            CurrentUser.GetId(),
            CurrentUser.Name.IsNullOrWhiteSpace()
                ? (CurrentUser.UserName ?? "?")
                : $"{CurrentUser.Name} {CurrentUser.SurName}".Trim(),
            dto.ViewerRole,
            null);

        await BroadcastPresenceAsync(applicationId);
    }

    public async Task Unsubscribe(Guid applicationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupOf(applicationId));
        Presence.TryRemove(Context.ConnectionId, out _);
        await BroadcastPresenceAsync(applicationId);
    }

    /// <summary>Kullanıcının o an hangi alanda olduğunu bildirir (imleç göstergesi).</summary>
    public async Task SetFocus(Guid applicationId, string? fieldKey)
    {
        if (Presence.TryGetValue(Context.ConnectionId, out var entry))
        {
            Presence[Context.ConnectionId] = entry with { FieldKey = fieldKey };
        }
        await BroadcastPresenceAsync(applicationId);
    }

    /// <summary>Veri değişti — karşı taraf yeniden okusun.</summary>
    public async Task NotifyChanged(Guid applicationId, string? fieldKey)
    {
        await Clients.OthersInGroup(GroupOf(applicationId))
            .SendAsync("ApplicationChanged", new { applicationId, fieldKey });
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Presence.TryRemove(Context.ConnectionId, out var entry))
        {
            await BroadcastPresenceAsync(entry.ApplicationId);
        }
        await base.OnDisconnectedAsync(exception);
    }

    private async Task BroadcastPresenceAsync(Guid applicationId)
    {
        var people = Presence.Values
            .Where(p => p.ApplicationId == applicationId)
            .GroupBy(p => p.UserId)
            .Select(g => new
            {
                userId = g.Key,
                name = g.First().Name,
                role = (int)g.First().Role,
                // Aynı kullanıcı iki sekme açtıysa son bildirdiği alan geçerlidir.
                fieldKey = g.Select(x => x.FieldKey).LastOrDefault(f => f != null)
            })
            .ToList();

        await Clients.Group(GroupOf(applicationId)).SendAsync("PresenceChanged", people);
    }
}
