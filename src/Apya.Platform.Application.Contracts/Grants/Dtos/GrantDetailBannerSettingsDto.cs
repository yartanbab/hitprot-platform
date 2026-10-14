namespace Apya.Platform.Grants.Dtos;

/// <summary>Kiracı hibe detayının afiş düzeni (bkz. <see cref="GrantDetailBannerVariants"/>).</summary>
public class GrantDetailBannerSettingsDto
{
    public string Variant { get; set; } = GrantDetailBannerVariants.Default;
}
