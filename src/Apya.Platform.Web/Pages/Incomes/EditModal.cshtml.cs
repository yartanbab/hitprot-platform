using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.Customers;
using Apya.Platform.Incomes;
using Apya.Platform.Projects;

namespace Apya.Platform.Web.Pages.Incomes;

public class EditModalModel : AbpPageModel
{
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly ICustomerAppService _customerAppService;

    [HiddenInput]
    [BindProperty]
    public Guid IncomeId { get; set; }

    [BindProperty]
    public CreateUpdateIncomeEntryDto Income { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    public EditModalModel(
        IIncomeEntryAppService incomeAppService,
        ICashAccountAppService cashAccountAppService,
        IProjectAppService projectAppService,
        ICustomerAppService customerAppService)
    {
        _incomeAppService = incomeAppService;
        _cashAccountAppService = cashAccountAppService;
        _projectAppService = projectAppService;
        _customerAppService = customerAppService;
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

        (Accounts, Projects, Customers, Categories, ProjectDatesJson) =
            await IncomeLookups.LoadAsync(_cashAccountAppService, _projectAppService, _customerAppService);
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _incomeAppService.UpdateAsync(IncomeId, Income);
        return NoContent();
    }
}
