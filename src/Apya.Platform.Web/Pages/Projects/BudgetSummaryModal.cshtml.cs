using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.ProjectFinance;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Projects;

// Beslendiği ProjectFinanceAppService ile aynı izin — sayfa seviyesinde
// yetki olmayınca anonim istek 302 yerine 500 dönüyordu.
[Authorize(PlatformPermissions.Projects.Default)]
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
