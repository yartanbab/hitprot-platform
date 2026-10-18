using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

[Authorize(PlatformPermissions.Grants.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly ICurrentTenant _currentTenant;

    // Host (CurrentTenant.Id == null) → katalog yönetimi; tenant → profil + öneri feed.
    public bool IsHost { get; private set; }

    /// <summary>21a/22 · Host Çağrılar sekmesi: "live" (varsayılan) ya da "draft". Kaynaklar ayrı sayfa.</summary>
    [BindProperty(SupportsGet = true)]
    public string? Tab { get; set; }

    /// <summary>
    /// X-05 · Kazıyıcı bağlanmadıysa (<see cref="NotConfiguredGrantScraper"/>) "Tümünü Tara" çizilmez:
    /// düğme her kaynak için yalnız "atlandı" koşusu bırakıyordu. Gerçek kazıyıcı kaydedilince geri gelir.
    /// </summary>
    public bool ScraperConnected { get; }

    public IndexModel(ICurrentTenant currentTenant, IGrantScraper scraper)
    {
        _currentTenant = currentTenant;
        ScraperConnected = scraper is not NotConfiguredGrantScraper;
    }

    public void OnGet()
    {
        IsHost = _currentTenant.Id == null;
        Tab = Tab == "draft" ? "draft" : "live";
    }
}
