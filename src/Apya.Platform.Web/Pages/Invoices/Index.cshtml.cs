using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Invoices;

[Authorize(PlatformPermissions.Invoices.Default)]
public class IndexModel : PageModel
{
    public void OnGet()
    {
    }
}
