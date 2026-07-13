using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.CashMovements;

// OnGetAsync, izin gerektiren ICashAccountAppService.GetListAsync'i çağırıyor.
// Page-level [Authorize] olmadan yetkisiz/anonim istek (dev'de) 500'e düşüyordu;
// bununla auth middleware'de temiz 302 (login) / 403 döner.
[Authorize(PlatformPermissions.CashMovements.Default)]
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
