using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.DynamicAssets;

[Authorize(PlatformPermissions.DynamicAssets.Default)]
public class BuilderModel : PageModel
{
    public void OnGet()
    {
    }
}
