namespace Apya.Platform.Grants;

/// <summary>
/// 18c · Çağrı hunisinin günlük sayılan olayları. Değerler kalıcıdır (satırda saklanır), yeniden numaralanmaz.
/// </summary>
public enum GrantCallStatKind
{
    /// <summary>pargetto.com herkese açık çağrı detayı (/Hibeler/Detay).</summary>
    PublicView = 0,

    /// <summary>Platformda kiracının çağrı detayı (/Grants/Detail).</summary>
    TenantView = 1
}
