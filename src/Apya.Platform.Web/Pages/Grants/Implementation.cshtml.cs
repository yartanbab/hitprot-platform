using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 6c · Uygulama &amp; Tahsilat. Firma da danışman da açar; yazma yetkisi serviste
/// role göre ayrışır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class ImplementationModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        return Id == Guid.Empty ? Redirect("/Grants/MyApplications") : Page();
    }
}
