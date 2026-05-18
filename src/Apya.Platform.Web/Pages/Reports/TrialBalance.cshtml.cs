using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Reports;

namespace Apya.Platform.Web.Pages.Reports;

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
}
