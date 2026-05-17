using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;

namespace Apya.Platform.Web.Pages.CashAccounts;

public class CreateModalModel : AbpPageModel
{
    private readonly ICashAccountAppService _cashAccountAppService;

    [BindProperty]
    public CreateUpdateCashAccountDto CashAccount { get; set; } = new();

    public List<SelectListItem> Types { get; set; } = new();
    public List<SelectListItem> Currencies { get; set; } = new();

    public CreateModalModel(ICashAccountAppService cashAccountAppService)
    {
        _cashAccountAppService = cashAccountAppService;
    }

    public virtual Task<IActionResult> OnGetAsync()
    {
        LoadLookups();
        return Task.FromResult<IActionResult>(Page());
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _cashAccountAppService.CreateAsync(CashAccount);
        return NoContent();
    }

    protected void LoadLookups()
    {
        Types = new List<SelectListItem>
        {
            new("Nakit", ((int)CashAccountType.Cash).ToString()),
            new("Banka", ((int)CashAccountType.Bank).ToString()),
            new("Kredi Kartı", ((int)CashAccountType.CreditCard).ToString())
        };
        Currencies = new List<SelectListItem>
        {
            new("₺ TRY", "TRY"),
            new("$ USD", "USD"),
            new("€ EUR", "EUR")
        };
    }
}
