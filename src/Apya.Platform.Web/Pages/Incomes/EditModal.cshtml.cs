using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Incomes;
using Apya.Platform.Projects;

namespace Apya.Platform.Web.Pages.Incomes;

[Authorize]
public class EditModalModel : AbpPageModel
{
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly IProjectAppService _projectAppService;

    [HiddenInput]
    [BindProperty]
    public Guid IncomeId { get; set; }

    [BindProperty]
    public CreateUpdateIncomeEntryDto Income { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    /// <summary>Para birimi seçeneği; Kurlar sayfasıyla aynı liste (FinanceLookupShared).</summary>
    public List<SelectListItem> Currencies { get; set; } = FinanceLookupShared.Currencies();

    public EditModalModel(
        IIncomeEntryAppService incomeAppService,
        IProjectAppService projectAppService)
    {
        _incomeAppService = incomeAppService;
        _projectAppService = projectAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        IncomeId = id;
        var dto = await _incomeAppService.GetAsync(id);

        Income.Title = dto.Title;
        Income.Amount = dto.Amount;
        Income.Currency = dto.Currency;
        Income.IncomeDate = dto.IncomeDate;
        Income.Category = dto.Category;
        Income.CashAccountId = dto.CashAccountId;
        Income.ProjectId = dto.ProjectId;
        Income.BudgetLineId = dto.BudgetLineId;
        // Giderdeki ile aynı sessiz kayıp buradaydı: TaskId kopyalanmadığı için
        // düzenleme kaydın görev bağını siliyordu.
        Income.TaskId = dto.TaskId;
        Income.CustomerId = dto.CustomerId;
        Income.Description = dto.Description;

        (Accounts, Projects, Categories, ProjectDatesJson) =
            await IncomeLookups.LoadAsync(_incomeAppService, _projectAppService);
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _incomeAppService.UpdateAsync(IncomeId, Income);
        return NoContent();
    }
}
