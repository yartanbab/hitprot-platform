using System.Threading.Tasks;
using Apya.Platform.Accounts.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.SettingManagement;
using Volo.Abp.Settings;

namespace Apya.Platform.Accounts;

/// <summary>
/// Giriş ekranı yapılandırmasını okur/yazar.
///
/// [AllowAnonymous] bilerek SINIFA DEĞİL metoda konuldu: sınıf seviyesindeki
/// AllowAnonymous, üretilen API controller'ında UpdateAsync'in [Authorize]'unu da
/// devre dışı bırakırdı (endpoint metadata'sındaki tek IAllowAnonymous yetkilendirmeyi
/// atlatır). Bu haliyle okuma anonim, yazma izne bağlı.
/// </summary>
public class LoginScreenSettingsAppService : ApplicationService, ILoginScreenSettingsAppService
{
    private readonly ISettingManager _settingManager;

    public LoginScreenSettingsAppService(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    [AllowAnonymous]
    public async Task<LoginScreenSettingsDto> GetAsync()
    {
        // KRİTİK: bu ayarlar .WithProviders(Global) ile kısıtlı olduğundan
        // DefaultValueSettingValueProvider zincirde YOKTUR — her okumada açık
        // varsayılan verilmeli, aksi halde hiç yazılmamış ayar false gelir.
        return new LoginScreenSettingsDto
        {
            ShowTenantSwitch = await SettingProvider.GetAsync(
                PlatformSettings.Account.ShowTenantSwitch, PlatformSettingDefaults.AccountShowTenantSwitch),

            ShowSocialLogin = await SettingProvider.GetAsync(
                PlatformSettings.Account.ShowSocialLogin, PlatformSettingDefaults.AccountShowSocialLogin)
        };
    }

    [Authorize(PlatformPermissions.LoginScreen.Default)]
    public async Task UpdateAsync(LoginScreenSettingsDto input)
    {
        await _settingManager.SetGlobalAsync(
            PlatformSettings.Account.ShowTenantSwitch, input.ShowTenantSwitch.ToString().ToLowerInvariant());

        await _settingManager.SetGlobalAsync(
            PlatformSettings.Account.ShowSocialLogin, input.ShowSocialLogin.ToString().ToLowerInvariant());
    }
}
