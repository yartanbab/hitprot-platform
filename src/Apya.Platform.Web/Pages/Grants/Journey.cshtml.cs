using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 18d · Kiracı · Hibe Yolculuğum. Host'un firması olmadığı için host "Bugün"e yönlenir;
/// servis ayrıca kiracı bağlamı denetler.
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class JourneyModel : PlatformPageModel
{
    public IActionResult OnGet()
    {
        return CurrentTenant.Id == null ? Redirect("/Grants/Today") : Page();
    }
}
