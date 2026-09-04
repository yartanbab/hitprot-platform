using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Host: İlgi Talepleri kutusu. Kiracı bu sayfayı açamaz: izin host-only ve servis
/// ayrıca bağlam kontrolü yapar (emsal: <see cref="PipelineModel"/>).
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class InterestsModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
