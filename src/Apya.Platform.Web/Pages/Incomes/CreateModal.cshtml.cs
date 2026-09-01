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
using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Pages.Incomes;

public class CreateModalModel : AbpPageModel
{
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly ICustomerAppService _customerAppService;
    private readonly ITaskAppService _taskAppService;

    [BindProperty(SupportsGet = true)]
    public Guid? TaskId { get; set; }

    [BindProperty]
    public CreateUpdateIncomeEntryDto Income { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    public CreateModalModel(
        IIncomeEntryAppService incomeAppService,
        ICashAccountAppService cashAccountAppService,
        IProjectAppService projectAppService,
        ICustomerAppService customerAppService,
        ITaskAppService taskAppService)
    {
        _incomeAppService = incomeAppService;
        _cashAccountAppService = cashAccountAppService;
        _projectAppService = projectAppService;
        _customerAppService = customerAppService;
        _taskAppService = taskAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        (Accounts, Projects, Customers, Categories, ProjectDatesJson) =
            await IncomeLookups.LoadAsync(_cashAccountAppService, _projectAppService, _customerAppService);
        if (TaskId.HasValue)
        {
            Income.TaskId = TaskId;

            // Görev panelinden açıldığında projeyi de ÖNDEN seç: görev seçicisi
            // proje seçilene kadar gizli olduğu için, proje boş kalırsa gelen
            // TaskId POST'ta kaybolurdu.
            Income.ProjectId = await FinanceLookupShared.ResolveTaskProjectAsync(_taskAppService, TaskId.Value);
        }
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _incomeAppService.CreateAsync(Income);
        return NoContent();
    }
}
