namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı hibe detayının üst afişi için düzen seçenekleri. Değer ayar olarak saklanır
/// (<c>PlatformSettings.Grants.DetailBannerVariant</c>) ve sayfada CSS sınıfına dönüşür.
/// </summary>
public static class GrantDetailBannerVariants
{
    /// <summary>Kartın üstünde tam genişlik kapak görseli.</summary>
    public const string Cover = "cover";

    /// <summary>Başlık solda, görsel sağda.</summary>
    public const string Side = "side";

    /// <summary>Başlık görselin üstünde, metrikler taşan şeritte.</summary>
    public const string Overlay = "overlay";

    public const string Default = Cover;

    public static readonly string[] All = { Cover, Side, Overlay };

    /// <summary>Tanınmayan ya da boş değer varsayılana düşer: sayfa bozuk sınıfla basılmaz.</summary>
    public static string Normalize(string? value)
    {
        var trimmed = value?.Trim().ToLowerInvariant();
        return trimmed is Cover or Side or Overlay ? trimmed : Default;
    }
}
