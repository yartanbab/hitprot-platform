using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Dashboard;

/// <summary>
/// Dashboard sayfası — Bento widget grid'ini host eden Razor route'u.
/// İçerik tamamen React island'da (wwwroot/js/dashboard.js); bu PageModel
/// sadece auth ve mount surface'i sağlar.
/// </summary>
[Authorize]
public class IndexModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
