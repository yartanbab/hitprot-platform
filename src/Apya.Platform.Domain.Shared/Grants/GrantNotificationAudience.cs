namespace Apya.Platform.Grants;

/// <summary>
/// Bildirim şablonunun hedef kitlesi. Aynı tetikleyici her alıcı rolüne ayrı metinle gidebilir;
/// alıcının rolüne uyan şablon yoksa <see cref="Genel"/> şablon kullanılır.
///
/// <para>Rol kullanıcının bulunduğu taraftan (kiracı = firma, host = danışman) ve "admin" rolünden
/// türer: kullanıcılar arasında "yöneticisi kim" ilişkisi tutulmuyor.</para>
/// </summary>
public enum GrantNotificationAudience
{
    /// <summary>Rol şablonu olmayan herkes. Her tetikleyicinin bir Genel şablonu vardır.</summary>
    Genel = 0,

    /// <summary>Kiracıdaki "admin" rolü olmayan kullanıcı.</summary>
    FirmaKullanicisi = 1,

    /// <summary>Kiracıdaki "admin" rolü.</summary>
    FirmaYoneticisi = 2,

    /// <summary>Host'taki "admin" rolü olmayan kullanıcı.</summary>
    Danisman = 3,

    /// <summary>Host'taki "admin" rolü.</summary>
    HostYoneticisi = 4
}
