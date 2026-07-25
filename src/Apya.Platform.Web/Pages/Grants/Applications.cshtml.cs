using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

[Authorize(PlatformPermissions.Grants.Edit)]
public class ApplicationsModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
