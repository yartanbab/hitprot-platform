using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Ai.Permissions;

namespace Apya.Platform.Web.Pages.AiCenter.PromptCategories;

[Authorize(AiPermissions.Prompts.Default)]
public class IndexModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
