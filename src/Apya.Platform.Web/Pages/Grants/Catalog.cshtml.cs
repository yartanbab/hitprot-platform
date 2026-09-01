using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>9a · Kiracı: Tüm Açık Hibeler (tam katalog).</summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class CatalogModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
