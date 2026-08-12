using Apya.Platform.Web.Pages;
using Volo.Abp.MultiTenancy;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Grants;

[Authorize(PlatformPermissions.Grants.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly ICurrentTenant _currentTenant;

    // Host (CurrentTenant.Id == null) → katalog yönetimi; tenant → profil + öneri feed.
    public bool IsHost { get; private set; }

    public IndexModel(ICurrentTenant currentTenant)
    {
        _currentTenant = currentTenant;
    }

    public void OnGet()
    {
        IsHost = _currentTenant.Id == null;
    }
}
