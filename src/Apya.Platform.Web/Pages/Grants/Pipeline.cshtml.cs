using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 2c · Host başvuru pipeline konsolu. Kiracı bu sayfayı açamaz: izin host-only
/// ve servis ayrıca bağlam kontrolü yapar.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class PipelineModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
