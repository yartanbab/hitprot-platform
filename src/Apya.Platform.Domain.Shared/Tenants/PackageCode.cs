namespace Apya.Platform.Tenants;

/// <summary>
/// Tenant'a atanan satış paketi (edition). Paket, tenant'ın hangi feature'lara
/// (ve hangi limitlere) sahip olduğunu belirler; feature'lar da permission tavanını
/// belirler. Paket→feature eşlemesi: <see cref="Apya.Platform.Tenants.Packages.PackageDefinitions"/>.
/// </summary>
public enum PackageCode
{
    Basic = 1,
    Standard = 2,
    Premium = 3,
    Enterprise = 4
}
