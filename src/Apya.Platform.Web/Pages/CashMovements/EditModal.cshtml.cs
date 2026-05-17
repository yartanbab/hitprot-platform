using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;

namespace Apya.Platform.Web.Pages.CashMovements;

public class EditModalModel : AbpPageModel
{
    private readonly ICashMovementAppService _cashMovementAppService;
    private readonly ICashAccountAppService _cashAccountAppService;

    [HiddenInput]
    [BindProperty]
    public Guid MovementId { get; set; }

    [BindProperty]
    public CreateUpdateCashMovementDto Movement { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Directions { get; set; } = new();

    public EditModalModel(
        ICashMovementAppService cashMovementAppService,
        ICashAccountAppService cashAccountAppService)
    {
        _cashMovementAppService = cashMovementAppService;
        _cashAccountAppService = cashAccountAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        MovementId = id;
        var dto = await _cashMovementAppService.GetAsync(id);

        Movement.CashAccountId = dto.CashAccountId;
        Movement.Direction = dto.Direction;
        Movement.Amount = dto.Amount;
        Movement.MovementDate = dto.MovementDate;
        Movement.Description = dto.Description;

        await LoadLookupsAsync();
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _cashMovementAppService.UpdateAsync(MovementId, Movement);
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
