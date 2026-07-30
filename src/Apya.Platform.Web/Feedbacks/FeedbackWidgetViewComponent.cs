using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Feedbacks;

/// <summary>
/// Header toolbar'ında sade "Geri Bildirim" linki + her sayfada gizli duran gönderim
/// modalı. Yalnızca oturum açmış kullanıcıda render edilir (gönderme izin gerektirmez,
/// yalnızca oturum — bkz. PlatformPermissions.Feedbacks yorumu).
/// </summary>
public class FeedbackWidgetViewComponent : AbpViewComponent
{
    protected ICurrentUser CurrentUser { get; }

    public FeedbackWidgetViewComponent(ICurrentUser currentUser)
    {
        CurrentUser = currentUser;
    }

    public IViewComponentResult Invoke()
    {
        if (!CurrentUser.IsAuthenticated)
        {
            return View("Empty");
        }

        return View();
    }
}
