using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 11a/11b · "Bugün". Kiracıda firmanın işleri, host'ta danışman ekibinin gelen kutusu.
/// İçeriği tek uç (<c>IGrantTodayAppService</c>) verir; sayfa yalnız hangi kabuğun
/// çizileceğini söyler.
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class TodayModel : PlatformPageModel
{
    private readonly ICurrentTenant _currentTenant;

    public bool IsHost { get; private set; }

    public TodayModel(ICurrentTenant currentTenant)
    {
        _currentTenant = currentTenant;
    }

    public void OnGet()
    {
        IsHost = _currentTenant.Id == null;
    }
}
