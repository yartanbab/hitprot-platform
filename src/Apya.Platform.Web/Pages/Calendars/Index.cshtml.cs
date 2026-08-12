using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Calendars;

[Authorize(PlatformPermissions.Calendars.Default)]
public class IndexModel : AbpPageModel
{
    public void OnGet()
    {
    }
}
