using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Apya.Platform.Web.Pages.F;

/// <summary>
/// Public, anonymous landing page for a published form, addressed by slug (/f/{slug}).
/// </summary>
[AllowAnonymous]
public class IndexModel : PageModel
{
    public string Slug { get; set; } = string.Empty;

    public void OnGet(string slug)
    {
        Slug = slug;
    }
}
