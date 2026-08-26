namespace Apya.Platform.Tenants;

/// <summary>
/// Abonelik satırının yaşam döngüsü. Bir kiracının aynı anda en fazla bir
/// <see cref="Active"/>/<see cref="InGrace"/> satırı olur; kalanlar geçmiştir.
/// </summary>
public enum SubscriptionStatus
{
    /// <summary>Yürürlükte. Bitiş tarihi yok ya da henüz gelmedi.</summary>
    Active = 1,

    /// <summary>
    /// Bitiş tarihi geçti ama ek süre (grace) devam ediyor: paket HÂLÂ AÇIK.
    /// Ek süre ayarı 0 ise bu duruma hiç girilmez, doğrudan <see cref="Expired"/> olunur.
    /// </summary>
    InGrace = 2,

    /// <summary>Süresi doldu, kiracı Basic'e düşürüldü.</summary>
    Expired = 3,

    /// <summary>Süresi dolmadan başka bir paket/dönem atandığı için kapandı.</summary>
    Superseded = 5
}
