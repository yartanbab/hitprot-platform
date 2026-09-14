using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 18a · Host: tek ilgi talebinin inceleme ekranı. İlgi Talepleri kutusundan açılır; kutu yerinde
/// kalır (karar 3). Servis ayrıca host bağlamı denetler.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class InterestReviewModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        return Id == Guid.Empty ? Redirect("/Grants/Interests") : Page();
    }
}
