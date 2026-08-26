namespace Apya.Platform.Tenants;

/// <summary>
/// Abonelik dönemi. Sayısal değer AY SAYISIDIR: bitiş tarihi
/// <c>StartDate.AddMonths((int)period)</c> ile hesaplanır — ayrı bir eşleme tablosu yok.
/// <para><see cref="Unlimited"/> (0) süresiz aboneliktir: bitiş tarihi <c>null</c> kalır ve
/// <see cref="TenantSubscription"/> hiçbir zaman <see cref="PackageCode.Basic"/>'e düşürülmez.
/// Host'un elle verdiği paketler ve otomatik düşüşten sonra açılan Basic aboneliği budur.</para>
/// </summary>
public enum SubscriptionPeriod
{
    Unlimited = 0,
    Monthly = 1,
    Quarterly = 3,
    SemiAnnual = 6,
    Annual = 12
}
