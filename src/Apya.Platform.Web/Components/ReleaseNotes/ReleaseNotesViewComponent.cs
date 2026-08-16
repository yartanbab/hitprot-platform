using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Web.ReleaseNotes;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Settings;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Components.ReleaseNotes;

/// <summary>
/// İlk açılış "Yenilikler" penceresi — <c>LayoutHooks.Body.Last</c> ile her sayfaya eklenir
/// (CookieNotice ile aynı desen). Yalnızca giriş yapmış kullanıcı katalogdaki EN YENİ sürümü
/// daha önce görmediyse modal render edilir; aksi halde hiçbir şey basılmaz. Görülme,
/// kullanıcı ayarında (<see cref="PlatformSettings.ReleaseNotes.LastSeenVersion"/>) saklanır.
/// </summary>
public class ReleaseNotesViewComponent : AbpViewComponent
{
    private readonly ISettingProvider _settingProvider;
    private readonly ICurrentUser _currentUser;

    public ReleaseNotesViewComponent(ISettingProvider settingProvider, ICurrentUser currentUser)
    {
        _settingProvider = settingProvider;
        _currentUser = currentUser;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!_currentUser.IsAuthenticated)
        {
            return Content(string.Empty);
        }

        var lastSeen = await _settingProvider.GetOrNullAsync(PlatformSettings.ReleaseNotes.LastSeenVersion);
        var latest = ReleaseNoteCatalog.Latest;

        if (lastSeen == latest.Version)
        {
            return Content(string.Empty);
        }

        return View(latest);
    }
}
