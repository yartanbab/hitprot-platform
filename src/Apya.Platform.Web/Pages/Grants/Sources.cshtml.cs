using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 1a · Kaynak &amp; Kazıma Konsolu. Grants.Edit izni tanım gereği host-only
/// (PlatformPermissionDefinitionProvider), sayfa da yalnız host'ta açılır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class SourcesModel : PlatformPageModel
{
    /// <summary>X-05 · bkz. <see cref="IndexModel.ScraperConnected"/>.</summary>
    public bool ScraperConnected { get; }

    public SourcesModel(IGrantScraper scraper)
    {
        ScraperConnected = scraper is not NotConfiguredGrantScraper;
    }

    public void OnGet()
    {
    }
}
