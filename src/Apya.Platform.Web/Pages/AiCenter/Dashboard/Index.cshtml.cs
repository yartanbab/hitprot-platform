using System.Threading.Tasks;
using Apya.Platform.Ai.Dashboard;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.AiCenter.Dashboard;

[Authorize(AiPermissions.Dashboard.View)]
public class IndexModel : PlatformPageModel
{
    private readonly IAiDashboardAppService _dashboardAppService;

    public AiDashboardDto Data { get; set; } = new();

    public IndexModel(IAiDashboardAppService dashboardAppService)
    {
        _dashboardAppService = dashboardAppService;
    }

    public async Task OnGetAsync()
    {
        Data = await _dashboardAppService.GetAsync();
    }
}
