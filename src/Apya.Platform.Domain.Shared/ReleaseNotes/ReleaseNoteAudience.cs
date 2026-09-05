namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Bir sürüm notu maddesinin kime gösterileceği. Kiracıların kendi rol adları host
/// tarafında bilinemediği için hiyerarşi sabit üç basamaktır; "kiracı yöneticisi"
/// <c>PlatformPermissions.TenantSettings.Default</c> iznine sahip kullanıcı demektir.
/// </summary>
public enum ReleaseNoteAudience : byte
{
    /// <summary>Oturum açmış her kullanıcı (paket kapısı ayrıca uygulanır).</summary>
    Everyone = 0,

    /// <summary>Yalnız kiracı yöneticileri — kiracı ayarlarını görebilenler.</summary>
    TenantAdmins = 1,

    /// <summary>Yalnız host. Hiçbir kiracı kullanıcısına gösterilmez.</summary>
    HostOnly = 2
}
