using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Controllers;
using Apya.Platform.Dashboard.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;

namespace Apya.Platform.Dashboard;

/// <summary>
/// /Dashboard React island'ının okuma uçları. Her bölüm kendi ucundan tek istekle beslenir.
/// Yetkilendirme <see cref="IDashboardAppService"/> üzerindedir; burada tekrarlanmaz.
/// </summary>
[Authorize] // Projede global fallback authorization policy YOK → açıkça gerekli.
[RemoteService(Name = "Dashboard")]
[Route("api/dashboard")]
public class DashboardController : PlatformController
{
    private readonly IDashboardAppService _dashboardAppService;

    public DashboardController(IDashboardAppService dashboardAppService)
    {
        _dashboardAppService = dashboardAppService;
    }

    [HttpGet("summary")]
    public Task<DashboardSummaryDto> GetSummaryAsync([FromQuery] DashboardQueryDto input)
        => _dashboardAppService.GetSummaryAsync(input);

    [HttpGet("deliveries")]
    public Task<List<DeliveryItemDto>> GetDeliveriesAsync([FromQuery] DashboardQueryDto input)
        => _dashboardAppService.GetDeliveriesAsync(input);

    [HttpGet("project-health")]
    public Task<List<ProjectHealthDto>> GetProjectHealthAsync([FromQuery] DashboardQueryDto input)
        => _dashboardAppService.GetProjectHealthAsync(input);

    [HttpGet("pending-approvals")]
    public Task<List<PendingApprovalDto>> GetPendingApprovalsAsync()
        => _dashboardAppService.GetPendingApprovalsAsync();

    [HttpGet("blocked-tasks")]
    public Task<List<BlockedTaskDto>> GetBlockedTasksAsync()
        => _dashboardAppService.GetBlockedTasksAsync();

    [HttpGet("statistics")]
    public Task<List<DashboardStatDto>> GetStatisticsAsync([FromQuery] DashboardQueryDto input)
        => _dashboardAppService.GetStatisticsAsync(input);

    [HttpGet("income-expense")]
    public Task<IncomeExpenseDto> GetIncomeExpenseAsync([FromQuery] DashboardQueryDto input)
        => _dashboardAppService.GetIncomeExpenseAsync(input);

    [HttpGet("delivery-heatmap")]
    public Task<List<DeliveryHeatmapCellDto>> GetDeliveryHeatmapAsync([FromQuery] DashboardQueryDto input)
        => _dashboardAppService.GetDeliveryHeatmapAsync(input);

    [HttpGet("layout")]
    public Task<DashboardLayoutDto> GetLayoutAsync([FromQuery] string viewKey)
        => _dashboardAppService.GetLayoutAsync(viewKey);

    [HttpPut("layout")]
    public Task SaveLayoutAsync([FromBody] SaveDashboardLayoutInput input)
        => _dashboardAppService.SaveLayoutAsync(input);

    [HttpDelete("layout")]
    public Task ResetLayoutAsync([FromQuery] string viewKey)
        => _dashboardAppService.ResetLayoutAsync(viewKey);
}
