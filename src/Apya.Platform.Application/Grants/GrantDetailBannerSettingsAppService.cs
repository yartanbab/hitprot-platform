using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Grants;

/// <summary>
/// Afiş düzeni ayarını okur/yazar. Yalnız sayfa modellerinden çağrılır; uç üretilmez
/// (sınıf düzeyinde kapalı — metot düzeyindeki kapatma eylemi silmiyor).
/// </summary>
[RemoteService(IsEnabled = false)]
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantDetailBannerSettingsAppService : ApplicationService, IGrantDetailBannerSettingsAppService
{
    private readonly ISettingManager _settingManager;

    public GrantDetailBannerSettingsAppService(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    public async Task<GrantDetailBannerSettingsDto> GetAsync()
    {
        // Ayar .WithProviders(Global) ile kısıtlı: varsayılan sağlayıcı zincirde yok,
        // hiç yazılmamış değer null gelir. Normalize onu varsayılan düzene indirir.
        return new GrantDetailBannerSettingsDto
        {
            Variant = GrantDetailBannerVariants.Normalize(
                await SettingProvider.GetOrNullAsync(PlatformSettings.Grants.DetailBannerVariant))
        };
    }

    // Grants.Edit tanım gereği host'a özeldir; kiracı bu izni taşıyamaz.
    [Authorize(PlatformPermissions.Grants.Edit)]
    public async Task UpdateAsync(GrantDetailBannerSettingsDto input)
    {
        await _settingManager.SetGlobalAsync(
            PlatformSettings.Grants.DetailBannerVariant,
            GrantDetailBannerVariants.Normalize(input.Variant));
    }
}
