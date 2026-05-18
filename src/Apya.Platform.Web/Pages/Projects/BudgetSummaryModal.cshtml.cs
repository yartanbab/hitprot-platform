using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.ProjectFinance;

namespace Apya.Platform.Web.Pages.Projects;

public class BudgetSummaryModalModel : AbpPageModel
{
    private readonly IProjectFinanceAppService _projectFinanceAppService;

    public ProjectFinanceSummaryDto Summary { get; set; } = new();

    public BudgetSummaryModalModel(IProjectFinanceAppService projectFinanceAppService)
    {
        _projectFinanceAppService = projectFinanceAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid projectId)
    {
        Summary = await _projectFinanceAppService.GetSummaryAsync(projectId);
        return Page();
    }
}
