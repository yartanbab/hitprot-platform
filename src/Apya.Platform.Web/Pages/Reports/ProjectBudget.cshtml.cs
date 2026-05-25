using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectFinance;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Reports;

[Authorize(Apya.Platform.Permissions.PlatformPermissions.Projects.Default)]
public class ProjectBudgetModel : AbpPageModel
{
    private readonly IProjectFinanceAppService _financeService;
    private readonly IProjectAppService _projectService;

    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    public ProjectFinanceSummaryDto? Summary { get; set; }
    public List<ProjectDto> Projects { get; set; } = new();

    public ProjectBudgetModel(
        IProjectFinanceAppService financeService,
        IProjectAppService projectService)
    {
        _financeService = financeService;
        _projectService = projectService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var result = await _projectService.GetListAsync(
            new PagedAndSortedResultRequestDto { MaxResultCount = 1000, Sorting = "Name asc" });
        Projects = result.Items.ToList();

        if (ProjectId.HasValue)
            Summary = await _financeService.GetSummaryAsync(ProjectId.Value);

        return Page();
    }

    public virtual async Task<IActionResult> OnGetExcelAsync()
    {
        if (!ProjectId.HasValue) return BadRequest();
        var s = await _financeService.GetSummaryAsync(ProjectId.Value);
        var bytes = ReportExporter.ProjectBudgetToExcel(s);
        var fileName = $"Butce_{s.ProjectName.Replace(" ", "_")}.xlsx";
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }

    public virtual async Task<IActionResult> OnGetPdfAsync()
    {
        if (!ProjectId.HasValue) return BadRequest();
        var s = await _financeService.GetSummaryAsync(ProjectId.Value);
        var bytes = ReportExporter.ProjectBudgetToPdf(s);
        var fileName = $"Butce_{s.ProjectName.Replace(" ", "_")}.pdf";
        return File(bytes, "application/pdf", fileName);
    }
}
