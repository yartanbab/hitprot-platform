using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 4b · Eşleştirme Ağırlıkları. Bir programın bağlamında açılır (1b'den gelinir);
/// "tüm programlar için varsayılan yap" seçeneği küresel satıra yazar.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class MatchWeightsModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        return Id == Guid.Empty ? RedirectToPage("./Index") : Page();
    }
}
