using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 3a · Elle Hibe Girme. Grants.Edit izni tanım gereği host-only
/// (PlatformPermissionDefinitionProvider), sayfa da yalnız host'ta açılır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class ImportModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
