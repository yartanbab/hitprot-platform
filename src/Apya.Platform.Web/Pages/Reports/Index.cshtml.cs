using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Reports;

[Authorize(PlatformPermissions.Reports.Default)]
public class IndexModel : PageModel
{
    public void OnGet()
    {
    }
}
