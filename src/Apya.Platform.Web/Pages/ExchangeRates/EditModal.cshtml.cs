using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.ExchangeRates;

namespace Apya.Platform.Web.Pages.ExchangeRates;

public class EditModalModel : AbpPageModel
{
    private readonly IExchangeRateAppService _exchangeRateAppService;

    [HiddenInput]
    [BindProperty]
    public Guid ExchangeRateId { get; set; }

    [BindProperty]
    public CreateUpdateExchangeRateDto ExchangeRate { get; set; } = new();

    public List<SelectListItem> Currencies { get; set; } = new();

    public EditModalModel(IExchangeRateAppService exchangeRateAppService)
    {
        _exchangeRateAppService = exchangeRateAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        ExchangeRateId = id;
        var dto = await _exchangeRateAppService.GetAsync(id);

        ExchangeRate.FromCurrency = dto.FromCurrency;
        ExchangeRate.ToCurrency = dto.ToCurrency;
        ExchangeRate.Rate = dto.Rate;
        ExchangeRate.RateDate = dto.RateDate;

        LoadCurrencies();
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _exchangeRateAppService.UpdateAsync(ExchangeRateId, ExchangeRate);
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
