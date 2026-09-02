using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 2e · Onay → projeye dönüştürme sihirbazı. Host-only; servis ayrıca bağlam
/// kontrolü yapar.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class ConvertModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        return Id == Guid.Empty ? Redirect("/Grants/Pipeline") : Page();
    }
}
