using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Bütçe kalemi ekleme/düzenleme. Tek modal iki iş yapar: <see cref="Id"/> boşsa
/// ekler, doluysa günceller — alanlar birebir aynı, iki kopya markup istemiyoruz.
/// </summary>
public class BudgetLineModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    /// <summary>Boşsa yeni kalem.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? Id { get; set; }

    [BindProperty]
    public CreateUpdateBudgetLineDto Line { get; set; } = new();

    public bool IsEdit => Id.HasValue;

    public BudgetLineModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        if (Id.HasValue)
        {
            var existing = (await _budgetAppService.GetLinesAsync(ProjectId)).First(x => x.Id == Id.Value);
            Line = new CreateUpdateBudgetLineDto
            {
                Code = existing.Code,
                Name = existing.Name,
                PlannedAmount = existing.PlannedAmount,
                ApprovedAmount = existing.ApprovedAmount,
                TransferLimitPercent = existing.TransferLimitPercent
            };
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        if (Id.HasValue)
        {
            await _budgetAppService.UpdateLineAsync(Id.Value, Line);
        }
        else
        {
            await _budgetAppService.CreateLineAsync(ProjectId, Line);
        }

        return NoContent();
    }
}
