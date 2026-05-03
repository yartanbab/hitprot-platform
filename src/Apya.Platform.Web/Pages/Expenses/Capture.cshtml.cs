using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Expenses;

[Authorize]
public class CaptureModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
