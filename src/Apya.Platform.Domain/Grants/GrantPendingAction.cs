using System;
using System.Collections.Generic;

namespace Apya.Platform.Grants;

/// <summary>
/// Bir tetikleyicinin beklediği ve henüz yapılmamış iş. Ayrı bir tabloda TUTULMAZ: her turda kayıtların
/// durumundan türetilir (<see cref="GrantEscalationManager"/>), böylece iş yapıldığı anda kendiliğinden düşer.
/// </summary>
/// <param name="EntityId">Bekleyen işin kaydı; tekrar koruması bu kimlikle tutulur.</param>
/// <param name="DeepLinkId">Bildirime tıklanınca açılacak kayıt.</param>
/// <param name="TenantId">İşin ait olduğu firma (kiracı).</param>
/// <param name="ActingSide">İşi yapması beklenen taraf: firma ya da danışman.</param>
/// <param name="AssignedUserId">Atanan danışman; yoksa danışman tarafı host ekibidir.</param>
/// <param name="Since">İşin beklemeye girdiği an. Aynı iş yeniden beklemeye girerse kademeler baştan sayılır.</param>
public record GrantPendingAction(
    GrantNotificationTrigger Trigger,
    Guid EntityId,
    string EntityType,
    Guid DeepLinkId,
    Guid? TenantId,
    GrantPartyRole ActingSide,
    Guid? AssignedUserId,
    DateTime Since,
    Dictionary<string, string?> Values);
