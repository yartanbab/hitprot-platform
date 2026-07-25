using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages;

// "/" ile "/Projects" aynı listeyi gösteriyordu (bkz. Menus/PlatformMenuContributor.cs);
// hedef tasarımda kök ayrı bir sayfa değil, "/Projects"e yönlenir.
public class IndexModel : PlatformPageModel
{
    public IActionResult OnGet()
    {
        return RedirectToPage("/Projects/Index");
    }
}