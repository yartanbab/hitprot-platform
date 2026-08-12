using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Projects;

[Authorize(PlatformPermissions.Projects.Default)]
public class IndexModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
