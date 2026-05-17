using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;

namespace Apya.Platform.Web.Pages.CashMovements;

public class IndexModel : AbpPageModel
{
    private readonly ICashAccountAppService _cashAccountAppService;

    public List<SelectListItem> Accounts { get; set; } = new();

    public IndexModel(ICashAccountAppService cashAccountAppService)
    {
        _cashAccountAppService = cashAccountAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var result = await _cashAccountAppService.GetListAsync(
            new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true });
        Accounts = result.Items
            .Select(a => new SelectListItem($"{a.Name} ({a.Currency})", a.Id.ToString()))
            .ToList();
        return Page();
    }
}
