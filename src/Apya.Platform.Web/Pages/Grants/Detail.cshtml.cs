using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>1e · Kiracı: Hibe Detayı.</summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class DetailModel : PlatformPageModel
{
    private readonly IGrantFunnelAppService _funnel;

    public DetailModel(IGrantFunnelAppService funnel)
    {
        _funnel = funnel;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (Id == Guid.Empty)
        {
            return RedirectToPage("./Index");
        }

        // 18c · Huni: sayfa açılışı bir görüntülenme; ekran içi yenilemeler (JS) sayılmaz. Host'un bakışı sayılmaz.
        await _funnel.RecordTenantViewAsync(Id);
        return Page();
    }
}
