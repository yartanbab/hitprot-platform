using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;

namespace Apya.Platform.Web.Pages.CashAccounts;

public class EditModalModel : AbpPageModel
{
    private readonly ICashAccountAppService _cashAccountAppService;

    [HiddenInput]
    [BindProperty]
    public Guid CashAccountId { get; set; }

    [BindProperty]
    public CreateUpdateCashAccountDto CashAccount { get; set; } = new();

    public List<SelectListItem> Types { get; set; } = new();
    public List<SelectListItem> Currencies { get; set; } = new();

    public EditModalModel(ICashAccountAppService cashAccountAppService)
    {
        _cashAccountAppService = cashAccountAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        CashAccountId = id;
        var dto = await _cashAccountAppService.GetAsync(id);

        CashAccount.Name = dto.Name;
        CashAccount.Type = dto.Type;
        CashAccount.Currency = dto.Currency;
        CashAccount.OpeningBalance = dto.OpeningBalance;
        CashAccount.Description = dto.Description;
        CashAccount.IsActive = dto.IsActive;

        LoadLookups();
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _cashAccountAppService.UpdateAsync(CashAccountId, CashAccount);
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
