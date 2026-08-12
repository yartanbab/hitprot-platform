using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Tasks
{
    [Authorize(PlatformPermissions.Tasks.Default)]
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
            // Sayfa yüklenirken özel bir işlem yapmıyoruz,
            // verileri JavaScript (AJAX) ile çekeceğiz.
        }
    }
}