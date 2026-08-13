namespace Apya.Platform.Accounts.Dtos;

/// <summary>
/// Giriş ekranının host seviyesindeki yapılandırması. Değerler ABP Setting olarak
/// saklanır, koda gömülü değildir.
/// </summary>
public class LoginScreenSettingsDto
{
    /// <summary>Kiracı (müşteri) seçici kutusu giriş ekranında gösterilsin mi?</summary>
    public bool ShowTenantSwitch { get; set; }

    /// <summary>Google / Microsoft düğmeleri gösterilsin mi?</summary>
    public bool ShowSocialLogin { get; set; }
}
