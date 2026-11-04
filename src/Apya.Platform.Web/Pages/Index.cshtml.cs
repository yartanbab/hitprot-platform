using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages;

// Kök ayrı bir sayfa değil, açılış ekranı Hızlı İşlemler'e ("/Makro") yönlenir. O sayfa
// [Authorize] olduğu için oturumsuz ziyaretçi çerçevenin challenge'ı ile
// "/Account/Login?ReturnUrl=%2FMakro"ya düşer; giriş sonrası yine oraya döner.
// (Önce "/Projects", 2026-11-04'e kadar "/Dashboard" idi.)
[AllowAnonymous]
public class IndexModel : PlatformPageModel
{
    public IActionResult OnGet()
    {
        return RedirectToPage("/Macros/Index");
    }
}