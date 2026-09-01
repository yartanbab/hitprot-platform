using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>Fonlama dilimi ekleme/düzenleme.</summary>
public class TrancheModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty(SupportsGet = true)]
    public Guid? Id { get; set; }

    [BindProperty]
    public CreateUpdateTrancheDto Tranche { get; set; } = new();

    public bool IsEdit => Id.HasValue;

    public TrancheModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        if (Id.HasValue)
        {
            var existing = (await _budgetAppService.GetTranchesAsync(ProjectId)).First(x => x.Id == Id.Value);
            Tranche = new CreateUpdateTrancheDto
            {
                Title = existing.Title,
                PlannedDate = existing.PlannedDate,
                PlannedAmount = existing.PlannedAmount,
                Note = existing.Note
            };
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        if (Id.HasValue)
        {
            await _budgetAppService.UpdateTrancheAsync(Id.Value, Tranche);
        }
        else
        {
            await _budgetAppService.CreateTrancheAsync(ProjectId, Tranche);
        }

        return NoContent();
    }
}
