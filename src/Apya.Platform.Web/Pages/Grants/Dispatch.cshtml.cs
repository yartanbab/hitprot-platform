using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 1c · Çağrı → Firma Eşleştirme ve Gönderim. Grants.Create izni tanım gereği host-only.
/// </summary>
[Authorize(PlatformPermissions.Grants.Create)]
public class DispatchModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        return Id == Guid.Empty ? RedirectToPage("./Index") : Page();
    }
}
