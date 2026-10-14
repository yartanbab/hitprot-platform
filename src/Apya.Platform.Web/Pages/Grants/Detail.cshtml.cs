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
    private readonly IGrantDetailBannerSettingsAppService _bannerSettings;

    public DetailModel(IGrantFunnelAppService funnel, IGrantDetailBannerSettingsAppService bannerSettings)
    {
        _funnel = funnel;
        _bannerSettings = bannerSettings;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    /// <summary>Afiş düzeni (host ayarı): cover / side / overlay.</summary>
    public string BannerVariant { get; private set; } = GrantDetailBannerVariants.Default;

    public async Task<IActionResult> OnGetAsync()
    {
        if (Id == Guid.Empty)
        {
            return RedirectToPage("./Index");
        }

        // 18c · Huni: sayfa açılışı bir görüntülenme; ekran içi yenilemeler (JS) sayılmaz. Host'un bakışı sayılmaz.
        await _funnel.RecordTenantViewAsync(Id);
        BannerVariant = (await _bannerSettings.GetAsync()).Variant;
        return Page();
    }
}
