using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.SystemHealth;

[Authorize(PlatformPermissions.SystemHealth.Default)]
public class IndexModel : AbpPageModel
{
    private readonly ISystemHealthAppService _systemHealthAppService;

    public SystemHealthDto Health { get; set; } = default!;

    public IndexModel(ISystemHealthAppService systemHealthAppService)
    {
        _systemHealthAppService = systemHealthAppService;
    }

    public async Task OnGetAsync()
    {
        Health = await _systemHealthAppService.GetAsync(7);
    }
}
