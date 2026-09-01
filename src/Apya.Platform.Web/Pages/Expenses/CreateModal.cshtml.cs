using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Pages.Expenses;

public class CreateModalModel : AbpPageModel
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly ICustomerAppService _customerAppService;
    private readonly ITaskAppService _taskAppService;

    [BindProperty(SupportsGet = true)]
    public Guid? TaskId { get; set; }

    [BindProperty]
    public CreateUpdateExpenseDto Expense { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    /// <summary>Para birimi seçeneği; Kurlar sayfasıyla aynı liste (FinanceLookupShared).</summary>
    public List<SelectListItem> Currencies { get; set; } = FinanceLookupShared.Currencies();

    public CreateModalModel(
        IExpenseAppService expenseAppService,
        ICashAccountAppService cashAccountAppService,
        IProjectAppService projectAppService,
        ICustomerAppService customerAppService,
        ITaskAppService taskAppService)
    {
        _expenseAppService = expenseAppService;
        _cashAccountAppService = cashAccountAppService;
        _projectAppService = projectAppService;
        _customerAppService = customerAppService;
        _taskAppService = taskAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        (Accounts, Projects, Customers, Categories, ProjectDatesJson) =
            await ExpenseLookups.LoadAsync(_cashAccountAppService, _projectAppService, _customerAppService);

        if (TaskId.HasValue)
        {
            Expense.TaskId = TaskId;

            // Görev panelinden açıldığında projeyi de ÖNDEN seç: görev seçicisi
            // proje seçilene kadar gizli olduğu için, proje boş kalırsa gelen
            // TaskId POST'ta kaybolurdu.
            Expense.ProjectId = await FinanceLookupShared.ResolveTaskProjectAsync(_taskAppService, TaskId.Value);
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _expenseAppService.CreateAsync(Expense);
        return NoContent();
    }
}
