using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages;

// Kök ayrı bir sayfa değil, "/Dashboard"a yönlenir. Dashboard [Authorize] olduğu için
// oturumsuz ziyaretçi çerçevenin challenge'ı ile "/Account/Login?ReturnUrl=%2FDashboard"a
// düşer; giriş sonrası yine Dashboard'a döner. (Eskiden "/Projects"e yönleniyordu.)
public class IndexModel : PlatformPageModel
{
    public IActionResult OnGet()
    {
        return RedirectToPage("/Dashboard/Index");
    }
}