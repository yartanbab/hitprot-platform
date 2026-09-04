using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Projects;

// Beslendiği ProjectBudgetAppService ile aynı izin — sayfa seviyesinde
// yetki olmayınca anonim istek 302 yerine 500 dönüyordu.
[Authorize(PlatformPermissions.Projects.ViewBudget)]
public class BudgetSummaryModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _projectBudgetAppService;

    public ProjectBudgetOverviewDto Budget { get; set; } = new();

    public BudgetSummaryModalModel(IProjectBudgetAppService projectBudgetAppService)
    {
        _projectBudgetAppService = projectBudgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid projectId)
    {
        Budget = await _projectBudgetAppService.GetOverviewAsync(projectId);
        return Page();
    }
}
