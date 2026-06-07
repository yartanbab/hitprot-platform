using Apya.Platform.Ai.Permissions;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.AiCenter.UsageLogs;

[Authorize(AiPermissions.UsageLogs.View)]
public class IndexModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
