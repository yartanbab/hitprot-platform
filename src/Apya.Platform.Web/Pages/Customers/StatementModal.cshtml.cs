using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CustomerLedger;

namespace Apya.Platform.Web.Pages.Customers;

public class StatementModalModel : AbpPageModel
{
    private readonly ICustomerLedgerAppService _customerLedgerAppService;

    public CustomerStatementDto Statement { get; set; } = new();

    public StatementModalModel(ICustomerLedgerAppService customerLedgerAppService)
    {
        _customerLedgerAppService = customerLedgerAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid customerId)
    {
        Statement = await _customerLedgerAppService.GetStatementAsync(customerId);
        return Page();
    }
}
