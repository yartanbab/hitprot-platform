using System.Threading.Tasks;
using Apya.Platform.Ai.Dashboard;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.AiCenter.Reports;

[Authorize(AiPermissions.Reports.View)]
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

    public async Task<IActionResult> OnGetExportExcelAsync()
    {
        if (!await AuthorizationService.IsGrantedAsync(AiPermissions.Reports.Export))
        {
            return Forbid();
        }

        var data = await _dashboardAppService.GetAsync();
        var bytes = Apya.Platform.Web.Pages.Reports.ReportExporter.AiSummaryToExcel(data);
        return File(bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "ai-degerlendirme-ozeti.xlsx");
    }

    public async Task<IActionResult> OnGetExportPdfAsync()
    {
        if (!await AuthorizationService.IsGrantedAsync(AiPermissions.Reports.Export))
        {
            return Forbid();
        }

        var data = await _dashboardAppService.GetAsync();
        var bytes = Apya.Platform.Web.Pages.Reports.ReportExporter.AiSummaryToPdf(data, Clock.Now);
        return File(bytes, "application/pdf", "ai-degerlendirme-ozeti.pdf");
    }
}
