namespace Apya.Platform.Grants;

/// <summary>
/// Bildirim şablonunun hedef kitlesi. Aynı tetikleyici her alıcı rolüne ayrı metinle gidebilir;
/// alıcının rolüne uyan şablon yoksa <see cref="Genel"/> şablon kullanılır.
///
/// <para>Rol kullanıcının bulunduğu taraftan (kiracı = firma, host = danışman) ve yönetici rolünden
/// türer: kullanıcılar arasında "yöneticisi kim" ilişkisi tutulmuyor. Yönetici rolü "Hesabına Gir" ile
/// aynı tanımdır: statik ya da "admin" adlı rol, ya da rol izinlerini yönetebilen rol.</para>
/// </summary>
public enum GrantNotificationAudience
{
    /// <summary>Rol şablonu olmayan herkes. Her tetikleyicinin bir Genel şablonu vardır.</summary>
    Genel = 0,

    /// <summary>Kiracıda yönetici rolü olmayan kullanıcı.</summary>
    FirmaKullanicisi = 1,

    /// <summary>Kiracıda yönetici rolü.</summary>
    FirmaYoneticisi = 2,

    /// <summary>Host'ta yönetici rolü olmayan kullanıcı.</summary>
    Danisman = 3,

    /// <summary>Host'ta yönetici rolü.</summary>
    HostYoneticisi = 4
}
