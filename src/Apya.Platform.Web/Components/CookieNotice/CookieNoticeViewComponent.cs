using Apya.Platform.Consents;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Apya.Platform.Web.Components.CookieNotice;

/// <summary>
/// Zorunlu çerez bilgilendirme şeridi — LayoutHooks.Body.Last ile her sayfaya
/// eklenir. "Anladım" çerezi (apya_cookie_ack) varsa hiçbir şey render etmez.
/// Rıza zorunluluğu YARATMAZ (yalnız zorunlu çerezler); onay ConsentRecord'a
/// yazılır ki admin analiz paneli beslensin.
/// </summary>
public class CookieNoticeViewComponent : AbpViewComponent
{
    public IViewComponentResult Invoke()
    {
        var acknowledged = HttpContext.Request.Cookies
            .ContainsKey(ConsentConsts.CookieNoticeAckCookieName);

        return View(acknowledged);
    }
}
