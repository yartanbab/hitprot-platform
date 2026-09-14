using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 18c · Host · Çağrı dönüşüm hunisi. Kiracıların ilgi ve başvurularını saydığı için yalnız host; kiracı
/// "Bugün"e yönlenir, servis ayrıca host bağlamı denetler.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class FunnelModel : PlatformPageModel
{
    public IActionResult OnGet()
    {
        return CurrentTenant.Id != null ? Redirect("/Grants/Today") : Page();
    }
}
