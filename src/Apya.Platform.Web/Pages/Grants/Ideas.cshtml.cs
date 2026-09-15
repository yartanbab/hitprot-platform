using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 19a/22 · Host: Fikir Havuzu — çağrıya bağlanmamış proje fikirleri, sekmesiz tek liste.
/// Kiracı kendi fikrini "Proje fikrimi paylaş"tan (/Grants/Idea) girer.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class IdeasModel : PlatformPageModel
{
    public IActionResult OnGet()
    {
        return CurrentTenant.Id != null ? Redirect("/Grants/Idea") : Page();
    }
}
