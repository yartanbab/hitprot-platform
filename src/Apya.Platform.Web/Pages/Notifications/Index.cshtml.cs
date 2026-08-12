using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Notifications;

[Authorize]
public class IndexModel : AbpPageModel
{
    public void OnGet()
    {

    }
}
