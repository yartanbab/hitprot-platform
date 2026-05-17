using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;

namespace Apya.Platform.Web.Pages.CashMovements;

public class CreateModalModel : AbpPageModel
{
    private readonly ICashMovementAppService _cashMovementAppService;
    private readonly ICashAccountAppService _cashAccountAppService;

    [BindProperty]
    public CreateUpdateCashMovementDto Movement { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Directions { get; set; } = new();

    public CreateModalModel(
        ICashMovementAppService cashMovementAppService,
        ICashAccountAppService cashAccountAppService)
    {
        _cashMovementAppService = cashMovementAppService;
        _cashAccountAppService = cashAccountAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        await LoadLookupsAsync();
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _cashMovementAppService.CreateAsync(Movement);
        return NoContent();
    }

    protected async Task LoadLookupsAsync()
    {
        var accounts = await _cashAccountAppService.GetListAsync(
            new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true });
        Accounts = accounts.Items
            .Select(a => new SelectListItem($"{a.Name} ({a.Currency})", a.Id.ToString()))
            .ToList();
        Directions = new List<SelectListItem>
        {
            new("Giriş (Tahsilat)", ((int)CashMovementDirection.In).ToString()),
            new("Çıkış (Ödeme)", ((int)CashMovementDirection.Out).ToString())
        };
    }
}
