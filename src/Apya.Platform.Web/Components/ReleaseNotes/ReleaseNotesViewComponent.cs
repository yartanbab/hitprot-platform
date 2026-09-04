using System.Threading.Tasks;
using Apya.Platform.ReleaseNotes;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Settings;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Components.ReleaseNotes;

/// <summary>
/// İlk açılış "Yenilikler" penceresi — <c>LayoutHooks.Body.Last</c> ile her sayfaya eklenir
/// (CookieNotice ile aynı desen). İçeriği <see cref="IReleaseNotePublicationAppService"/>
/// belirler: kullanıcının paketine ve seviyesine göre HOST'un onayladığı maddeler.
/// Gösterilecek madde yoksa hiçbir şey basılmaz.
/// </summary>
public class ReleaseNotesViewComponent : AbpViewComponent
{
    private readonly ISettingProvider _settingProvider;
    private readonly ICurrentUser _currentUser;
    private readonly IReleaseNotePublicationAppService _publicationAppService;

    public ReleaseNotesViewComponent(
        ISettingProvider settingProvider,
        ICurrentUser currentUser,
        IReleaseNotePublicationAppService publicationAppService)
    {
        _settingProvider = settingProvider;
        _currentUser = currentUser;
        _publicationAppService = publicationAppService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!_currentUser.IsAuthenticated)
        {
            return Content(string.Empty);
        }

        // Tanıtım turu henüz görülmediyse burası SUSAR: yeni kullanıcı ilk girişte
        // iki modalı üst üste almasın. Tur bitince (veya atlanınca) bu pencere normal
        // akışına döner — o sırada onaylı en yeni sürümü hâlâ görmemiş olacağı için
        // bir sonraki sayfa açılışında gösterilir.
        if (!await _settingProvider.IsTrueAsync(PlatformSettings.Tour.Completed))
        {
            return Content(string.Empty);
        }

        var modal = await _publicationAppService.GetModalOrNullAsync();
        if (modal == null)
        {
            return Content(string.Empty);
        }

        return View(modal);
    }
}
