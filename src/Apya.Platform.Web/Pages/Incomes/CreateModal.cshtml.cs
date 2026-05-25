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

public class CreateModalModel : AbpPageModel
{
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly ICustomerAppService _customerAppService;

    [BindProperty(SupportsGet = true)]
    public Guid? TaskId { get; set; }

    [BindProperty]
    public CreateUpdateIncomeEntryDto Income { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();

    public CreateModalModel(
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

    public virtual async Task<IActionResult> OnGetAsync()
    {
        (Accounts, Projects, Customers, Categories) =
            await IncomeLookups.LoadAsync(_cashAccountAppService, _projectAppService, _customerAppService);
        if (TaskId.HasValue)
            Income.TaskId = TaskId;
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _incomeAppService.CreateAsync(Income);
        return NoContent();
    }
}
