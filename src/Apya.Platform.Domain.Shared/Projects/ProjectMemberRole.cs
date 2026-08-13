namespace Apya.Platform.Projects;

/// <summary>
/// Projedeki üyelik rolü. YALNIZ ETİKETTİR — yetki taşımaz.
/// Yetkilendirme ABP izinleriyle (PlatformPermissions.Projects.*) yapılır;
/// "Lead" olmak kullanıcıya fazladan bir hak vermez. Rolü yetkiye bağlamak
/// TaskAppService'teki görünürlük mantığını da değiştirmeyi gerektirir,
/// bu bilinçli olarak kapsam dışı bırakıldı.
/// </summary>
public enum ProjectMemberRole
{
    /// <summary>Proje sorumlusu.</summary>
    Lead = 1,

    /// <summary>Projede aktif çalışan ekip üyesi.</summary>
    Member = 2,

    /// <summary>Yalnız izleyen (paydaş, danışman).</summary>
    Observer = 3
}
