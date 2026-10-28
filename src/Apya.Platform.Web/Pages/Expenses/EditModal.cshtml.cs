using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Expenses;
using Apya.Platform.Projects;

namespace Apya.Platform.Web.Pages.Expenses;

[Authorize]
public class EditModalModel : AbpPageModel
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly IProjectAppService _projectAppService;

    [HiddenInput]
    [BindProperty]
    public Guid ExpenseId { get; set; }

    [BindProperty]
    public CreateUpdateExpenseDto Expense { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    /// <summary>Para birimi seçeneği; Kurlar sayfasıyla aynı liste (FinanceLookupShared).</summary>
    public List<SelectListItem> Currencies { get; set; } = FinanceLookupShared.Currencies();

    public EditModalModel(
        IExpenseAppService expenseAppService,
        IProjectAppService projectAppService)
    {
        _expenseAppService = expenseAppService;
        _projectAppService = projectAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        ExpenseId = id;
        var dto = await _expenseAppService.GetAsync(id);

        Expense.Title = dto.Title;
        Expense.Amount = dto.Amount;
        Expense.Currency = dto.Currency;
        Expense.ExpenseDate = dto.ExpenseDate;
        Expense.Category = dto.Category;
        Expense.CashAccountId = dto.CashAccountId;
        Expense.ProjectId = dto.ProjectId;
        Expense.BudgetLineId = dto.BudgetLineId;
        // TaskId BURAYA HİÇ KOPYALANMIYORDU: form da basmadığı için düzenleme
        // POST'unda null gidiyor ve gider, görevin Finans sekmesinden SESSİZCE
        // düşüyordu. Alan artık forma da basıldığı için burada da doldurulur.
        Expense.TaskId = dto.TaskId;
        Expense.CustomerId = dto.CustomerId;
        Expense.Description = dto.Description;

        (Accounts, Projects, Categories, ProjectDatesJson) =
            await ExpenseLookups.LoadAsync(_expenseAppService, _projectAppService);
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _expenseAppService.UpdateAsync(ExpenseId, Expense);
        return NoContent();
    }
}
