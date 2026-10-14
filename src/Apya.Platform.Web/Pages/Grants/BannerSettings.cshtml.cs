using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Kiracı hibe detayının afiş düzeni. Grants.Edit izni tanım gereği host-only
/// (PlatformPermissionDefinitionProvider), sayfa da yalnız host'ta açılır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class BannerSettingsModel : PlatformPageModel
{
    private readonly IGrantDetailBannerSettingsAppService _settings;

    public BannerSettingsModel(IGrantDetailBannerSettingsAppService settings)
    {
        _settings = settings;
    }

    [BindProperty]
    public string Variant { get; set; } = GrantDetailBannerVariants.Default;

    public async Task OnGetAsync()
    {
        Variant = (await _settings.GetAsync()).Variant;
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _settings.UpdateAsync(new GrantDetailBannerSettingsDto { Variant = Variant });
        TempData["Saved"] = true;
        return RedirectToPage();
    }
}
