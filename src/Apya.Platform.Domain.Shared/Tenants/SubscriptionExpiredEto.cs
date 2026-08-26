using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Tenants;

/// <summary>
/// Bir kiracının paket süresi doldu ve kiracı <see cref="PackageCode.Basic"/>'e indirildi.
/// Otomatik düşürme ayarı kapalıyken YAYINLANMAZ (paket değişmediği için).
///
/// <para><b>ÖDEME KANCASI:</b> tahsilat modülü bu olayla "abonelik sona erdi" kaydını
/// kapatır / son fatura akışını yürütür.</para>
/// </summary>
[EventName("Apya.Platform.Tenants.SubscriptionExpired")]
public class SubscriptionExpiredEto
{
    public Guid TenantId { get; set; }
    public Guid SubscriptionId { get; set; }

    /// <summary>Süresi dolan paket (indirilmeden önceki).</summary>
    public PackageCode PreviousPackageCode { get; set; }

    public DateTime EndDate { get; set; }

    /// <summary>Ek süre verilmişse bittiği an; verilmemişse <c>null</c>.</summary>
    public DateTime? GraceEndedAt { get; set; }

    public string? ExternalReference { get; set; }
}
