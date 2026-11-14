using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Settings;

namespace Apya.Platform.Web.Transfer;

/// <summary>
/// İçe/dışa aktarmanın erişim kuralı — "tek anahtar". Anahtar KAPALIYKEN (varsayılan) aktarım
/// izinleri denetlenmez: modülü gören dışa, modülde kayıt açabilen içe aktarır; host'ta da kiracıda
/// da bugüne kadarki davranış. Host anahtarı açtığında her işlem ayrıca ilgili aktarım iznini ister
/// (<see cref="PlatformPermissions.DataTransfer"/>); izinler rol ekranından ve paket tavanından yönetilir.
/// </summary>
public class TransferAccess : ITransientDependency
{
    private readonly ISettingProvider _settings;
    private readonly IAuthorizationService _authorization;

    public TransferAccess(ISettingProvider settings, IAuthorizationService authorization)
    {
        _settings = settings;
        _authorization = authorization;
    }

    // Ayar yalnız genel (host) sağlayıcıdan okunur; varsayılan değer zincirde olmadığı için açıkça verilir.
    public Task<bool> IsEnforcedAsync()
        => _settings.GetAsync(PlatformSettings.DataTransfer.EnforcePermissions, false);

    public async Task<bool> IsGrantedAsync(string permission)
        => !await IsEnforcedAsync() || await _authorization.IsGrantedAsync(permission);

    public Task<bool> CanAsync(TransferDirection direction)
        => IsGrantedAsync(direction == TransferDirection.Export
            ? PlatformPermissions.DataTransfer.Export
            : PlatformPermissions.DataTransfer.Import);
}
