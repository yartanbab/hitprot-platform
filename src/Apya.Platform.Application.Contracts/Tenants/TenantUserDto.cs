using System;

namespace Apya.Platform.Tenants;

/// <summary>
/// Host'un "Şifre Belirle" ekranında listelenen kiracı kullanıcısı.
/// Şifre ya da hash TAŞIMAZ; yalnız kimin şifresinin yazılacağını seçtirir.
/// </summary>
public class TenantUserDto
{
    public Guid Id { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    /// <summary>Ad soyad; boşsa kullanıcı adı.</summary>
    public string DisplayName { get; set; } = string.Empty;
}
