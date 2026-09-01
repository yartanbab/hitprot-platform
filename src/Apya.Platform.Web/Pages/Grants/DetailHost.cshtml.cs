using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 2d · Başvuru detayı (danışman görünümü). Dosya adı <c>DetailHost</c>:
/// <c>Detail.cshtml</c> kiracının PROGRAM detayıdır (1e), bu ise host'un BAŞVURU
/// detayı — aynı ada konsaydı iki farklı ekran karışırdı.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class DetailHostModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        // Başvuru kimliği olmadan gösterilecek bir şey yok; pano listeler.
        return Id == Guid.Empty ? Redirect("/Grants/Pipeline") : Page();
    }
}
