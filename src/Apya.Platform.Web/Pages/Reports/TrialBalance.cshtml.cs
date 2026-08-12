using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Reports;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Reports;

[Authorize(PlatformPermissions.Reports.TrialBalance)]
public class TrialBalanceModel : AbpPageModel
{
    private readonly ITrialBalanceAppService _trialBalanceAppService;

    [BindProperty(SupportsGet = true)]
    public DateTime? FromDate { get; set; }

    [BindProperty(SupportsGet = true)]
    public DateTime? ToDate { get; set; }

    public TrialBalanceReportDto Report { get; set; } = new();

    public TrialBalanceModel(ITrialBalanceAppService trialBalanceAppService)
    {
        _trialBalanceAppService = trialBalanceAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        Report = await _trialBalanceAppService.GetAsync(new GetTrialBalanceInput
        {
            FromDate = FromDate,
            ToDate = ToDate
        });
        return Page();
    }

    public virtual async Task<IActionResult> OnGetExcelAsync()
    {
        var report = await _trialBalanceAppService.GetAsync(new GetTrialBalanceInput
        {
            FromDate = FromDate,
            ToDate = ToDate
        });
        var bytes = ReportExporter.TrialBalanceToExcel(report, FromDate, ToDate);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Mizan.xlsx");
    }

    public virtual async Task<IActionResult> OnGetPdfAsync()
    {
        var report = await _trialBalanceAppService.GetAsync(new GetTrialBalanceInput
        {
            FromDate = FromDate,
            ToDate = ToDate
        });
        var bytes = ReportExporter.TrialBalanceToPdf(report, FromDate, ToDate, Clock.Now);
        return File(bytes, "application/pdf", "Mizan.pdf");
    }
}
