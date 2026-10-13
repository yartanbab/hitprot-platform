using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>PRJ-08 · Gösterge ekleme / düzenleme.</summary>
[Authorize(PlatformPermissions.Projects.ManageIndicators)]
public class IndicatorModalModel : AbpPageModel
{
    private readonly IProjectIndicatorAppService _indicatorAppService;
    private readonly IProjectWorkStepAppService _workStepAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty(SupportsGet = true)]
    public Guid? Id { get; set; }

    [BindProperty]
    public CreateUpdateProjectIndicatorDto Indicator { get; set; } = new();

    public List<SelectListItem> WorkSteps { get; set; } = new();

    public bool IsEdit => Id.HasValue;

    public IndicatorModalModel(
        IProjectIndicatorAppService indicatorAppService,
        IProjectWorkStepAppService workStepAppService)
    {
        _indicatorAppService = indicatorAppService;
        _workStepAppService = workStepAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        if (Id.HasValue)
        {
            var existing = (await _indicatorAppService.GetListAsync(ProjectId)).First(x => x.Id == Id.Value);
            Indicator = new CreateUpdateProjectIndicatorDto
            {
                ProjectId = ProjectId,
                Name = existing.Name,
                Unit = existing.Unit,
                BaselineValue = existing.BaselineValue,
                TargetValue = existing.TargetValue,
                TargetDate = existing.TargetDate,
                WorkStepId = existing.WorkStepId
            };
        }

        WorkSteps = (await _workStepAppService.GetListAsync(ProjectId))
            .OrderBy(s => s.Order)
            .Select(s => new SelectListItem(s.Order + " · " + s.Name, s.Id.ToString()))
            .ToList();

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        Indicator.ProjectId = ProjectId;

        if (Id.HasValue)
        {
            await _indicatorAppService.UpdateAsync(Id.Value, Indicator);
        }
        else
        {
            await _indicatorAppService.CreateAsync(Indicator);
        }

        return NoContent();
    }
}
