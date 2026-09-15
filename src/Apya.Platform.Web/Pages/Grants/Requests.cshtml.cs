using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 22b · Host: Talepler › Yanıt bekleyen. İlgi talepleri ve ön değerlendirme talepleri tek listede;
/// "Yürüyen başvuru" sekmesi mevcut pano (/Grants/Pipeline) ve listedir (/Grants/Applications).
/// Kiracı açamaz: izin host-only ve servis ayrıca bağlam denetler.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class RequestsModel : PlatformPageModel
{
    public void OnGet()
    {
    }
}
