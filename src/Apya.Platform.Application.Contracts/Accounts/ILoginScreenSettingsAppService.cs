using System.Threading.Tasks;
using Apya.Platform.Accounts.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Accounts;

/// <summary>
/// Giriş ekranı yapılandırması. Okuma ANONİM'dir — giriş sayfası oturum açılmadan
/// render edilir; yazma <see cref="Permissions.PlatformPermissions.LoginScreen.Default"/> ister.
/// </summary>
public interface ILoginScreenSettingsAppService : IApplicationService
{
    Task<LoginScreenSettingsDto> GetAsync();

    Task UpdateAsync(LoginScreenSettingsDto input);
}
