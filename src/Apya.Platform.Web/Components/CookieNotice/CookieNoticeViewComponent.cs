using System.Threading.Tasks;
using Apya.Platform.Consents;
using Apya.Platform.Settings;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Settings;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Components.CookieNotice;

/// <summary>
/// Zorunlu çerez bilgilendirme şeridi — LayoutHooks.Body.Last ile her sayfaya
/// eklenir. Onayın İKİ dayanağı var, sırayla bakılır:
/// <list type="number">
///   <item>"Anladım" çerezi (<c>apya_cookie_ack</c>) — ucuz yol, I/O yok.</item>
///   <item>Çerez yoksa, giriş yapmış kullanıcının onay ayarı — çerez temizlenmiş,
///         başka tarayıcıya geçilmiş ya da ömrü dolmuş olabilir.</item>
/// </list>
/// Rıza zorunluluğu YARATMAZ (yalnız zorunlu çerezler); onay ConsentRecord'a
/// yazılır ki admin analiz paneli beslensin.
/// </summary>
public class CookieNoticeViewComponent : AbpViewComponent
{
    private readonly ISettingProvider _settingProvider;
    private readonly ICurrentUser _currentUser;

    public CookieNoticeViewComponent(ISettingProvider settingProvider, ICurrentUser currentUser)
    {
        _settingProvider = settingProvider;
        _currentUser = currentUser;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        // Çerez varsa hiçbir şey sorgulama: bu bileşen HER sayfada çalışır.
        if (HttpContext.Request.Cookies.ContainsKey(ConsentConsts.CookieNoticeAckCookieName))
        {
            return View(true);
        }

        var acknowledged = _currentUser.IsAuthenticated
                           && await _settingProvider.IsTrueAsync(PlatformSettings.CookieNotice.Acknowledged);

        return View(acknowledged);
    }
}
