using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Projects;

namespace Apya.Platform.Web.Pages.Expenses;

public class CreateModalModel : AbpPageModel
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly ICustomerAppService _customerAppService;

    [BindProperty]
    public CreateUpdateExpenseDto Expense { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();

    public CreateModalModel(
        IExpenseAppService expenseAppService,
        ICashAccountAppService cashAccountAppService,
        IProjectAppService projectAppService,
        ICustomerAppService customerAppService)
    {
        _expenseAppService = expenseAppService;
        _cashAccountAppService = cashAccountAppService;
        _projectAppService = projectAppService;
        _customerAppService = customerAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        (Accounts, Projects, Customers, Categories) =
            await ExpenseLookups.LoadAsync(_cashAccountAppService, _projectAppService, _customerAppService);
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _expenseAppService.CreateAsync(Expense);
        return NoContent();
    }
}
