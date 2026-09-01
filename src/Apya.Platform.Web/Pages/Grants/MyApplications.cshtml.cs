using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 6a · Kiracı · Başvurularım. Host tarafındaki karşılığı pipeline konsoludur (2c).
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class MyApplicationsModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
