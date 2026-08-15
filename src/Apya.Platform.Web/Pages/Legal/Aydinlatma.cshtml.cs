using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Apya.Platform.Web.Pages.Legal;

/// <summary>
/// KVKK md. 10 aydınlatma metni — oturumsuz erişilebilir (giriş/kayıt ekranından,
/// footer'dan ve genel form sayfasından linklenir).
/// </summary>
[AllowAnonymous]
public class AydinlatmaModel : PageModel
{
    public void OnGet()
    {
    }
}
