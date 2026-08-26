using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Tenants;

/// <summary>
/// Bir kiracının paket süresi dolmak üzere. Süre işleyicisi, ayarlanan uyarı eşiklerinde
/// (varsayılan 7 ve 1 gün kala) dönem başına bir kez yayınlar.
///
/// <para><b>ÖDEME KANCASI:</b> tahsilat modülü geldiğinde bu olaya abone olur, ödemeyi
/// başlatır ve başarılıysa <c>TenantSubscriptionManager.RenewAsync</c> çağırır. Bugün
/// dinleyeni yoktur; kullanıcı bildirimini süre işleyicisi kendisi gönderir.</para>
/// </summary>
[EventName("Apya.Platform.Tenants.SubscriptionExpiring")]
public class SubscriptionExpiringEto
{
    public Guid TenantId { get; set; }
    public Guid SubscriptionId { get; set; }
    public PackageCode PackageCode { get; set; }
    public DateTime EndDate { get; set; }

    /// <summary>Bitişe kalan gün — uyarının hangi eşikte tetiklendiği.</summary>
    public int DaysRemaining { get; set; }

    /// <summary>Kiracı otomatik yenilemeyi işaretlemiş mi? Bugün her zaman <c>false</c>.</summary>
    public bool AutoRenew { get; set; }

    /// <summary>Ödeme sağlayıcısındaki abonelik referansı. Bugün her zaman <c>null</c>.</summary>
    public string? ExternalReference { get; set; }
}
