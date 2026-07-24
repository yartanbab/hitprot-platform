using Apya.Platform.Web.Pages;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Web.Pages.Grants;

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
