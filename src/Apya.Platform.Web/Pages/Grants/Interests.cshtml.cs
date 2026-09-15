using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Eski İlgi Talepleri adresi. Tur 22'de liste Talepler › Yanıt bekleyen'e taşındı (ilgi ve ön
/// değerlendirme tek listede). Adres, eski bildirimlerdeki ve yer imlerindeki bağlantılar
/// kırılmasın diye yönlendirir.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class InterestsModel : PlatformPageModel
{
    public IActionResult OnGet() => Redirect("/Grants/Requests");
}
