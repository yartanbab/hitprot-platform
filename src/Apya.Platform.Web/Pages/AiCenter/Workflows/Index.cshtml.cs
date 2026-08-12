using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Ai.Permissions;

namespace Apya.Platform.Web.Pages.AiCenter.Workflows;

[Authorize(AiPermissions.Workflows.Default)]
public class IndexModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
