using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Apya.Platform.Web.Pages.Legal;

/// <summary>
/// Gizlilik Politikası — çerez bölümü dahil. Oturumsuz erişilebilir.
/// </summary>
[AllowAnonymous]
public class GizlilikModel : PageModel
{
    public void OnGet()
    {
    }
}
