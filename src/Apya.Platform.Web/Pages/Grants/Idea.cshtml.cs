using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 19a · Kiracı · Proje fikrimi paylaş. Fikir firmanındır; host havuza firma adına Fikir Havuzu
/// ekranından girer, bu yüzden host oraya yönlenir. Servis ayrıca kiracı bağlamı denetler.
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class IdeaModel : PlatformPageModel
{
    public IActionResult OnGet()
    {
        return CurrentTenant.Id == null ? Redirect("/Grants/Ideas") : Page();
    }
}
