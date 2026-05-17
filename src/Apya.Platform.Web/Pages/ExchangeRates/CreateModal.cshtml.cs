using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.ExchangeRates;

namespace Apya.Platform.Web.Pages.ExchangeRates;

public class CreateModalModel : AbpPageModel
{
    private readonly IExchangeRateAppService _exchangeRateAppService;

    [BindProperty]
    public CreateUpdateExchangeRateDto ExchangeRate { get; set; } = new();

    public List<SelectListItem> Currencies { get; set; } = new();

    public CreateModalModel(IExchangeRateAppService exchangeRateAppService)
    {
        _exchangeRateAppService = exchangeRateAppService;
    }

    public virtual Task<IActionResult> OnGetAsync()
    {
        LoadCurrencies();
        return Task.FromResult<IActionResult>(Page());
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _exchangeRateAppService.CreateAsync(ExchangeRate);
        return NoContent();
    }

    protected void LoadCurrencies()
    {
        Currencies = new List<SelectListItem>
        {
            new("USD", "USD"),
            new("EUR", "EUR"),
            new("GBP", "GBP"),
            new("TRY", "TRY")
        };
    }
}
