using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>Dilime kesinti ekler. Kararı (revizyon / finanse edilmeyen) ayrı adımda verilir.</summary>
public class DeductionModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public CreateDeductionDto Deduction { get; set; } = new();

    public FundingTrancheDto? Tranche { get; set; }

    public DeductionModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        Tranche = (await _budgetAppService.GetTranchesAsync(ProjectId)).First(x => x.Id == Id);
        Deduction.DeductionDate = Clock.Now.Date;
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _budgetAppService.AddDeductionAsync(Id, Deduction);
        return NoContent();
    }
}
