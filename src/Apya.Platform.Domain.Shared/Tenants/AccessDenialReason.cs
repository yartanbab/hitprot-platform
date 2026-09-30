namespace Apya.Platform.Tenants;

/// <summary>Yasaklı sayfanın sebebi — /AccessDenied sayfası metnini ve eylemini buna göre seçer.</summary>
public enum AccessDenialReason
{
    /// <summary>İzin adı yok ya da tanınmıyor (açık Forbid(), eski yer imi).</summary>
    Unknown,

    /// <summary>İzin tanımlı ve açık; kullanıcının rolüne verilmemiş.</summary>
    NotGranted,

    /// <summary>Kiracının paketi (feature ya da paket izin tavanı) kapatıyor.</summary>
    Package,

    /// <summary>Platform yönetimine (host) ait ekran; hiçbir kiracı paketi açmaz.</summary>
    HostOnly,

    /// <summary>Kiracıya ait ekran; host hesabından açılmaz.</summary>
    TenantOnly
}
