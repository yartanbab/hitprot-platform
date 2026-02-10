using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Apya.Platform.Web.Pages.Tasks
{
    public class IndexModel : PageModel
    {
        public void OnGet()
        {
            // Sayfa yüklenirken özel bir işlem yapmıyoruz,
            // verileri JavaScript (AJAX) ile çekeceğiz.
        }
    }
}