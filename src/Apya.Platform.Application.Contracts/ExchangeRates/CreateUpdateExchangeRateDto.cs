using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.ExchangeRates;

public class CreateUpdateExchangeRateDto
{
    [Required]
    [StringLength(ExchangeRateConsts.CurrencyLength, MinimumLength = ExchangeRateConsts.CurrencyLength)]
    public string FromCurrency { get; set; } = null!;

    [Required]
    [StringLength(ExchangeRateConsts.CurrencyLength, MinimumLength = ExchangeRateConsts.CurrencyLength)]
    public string ToCurrency { get; set; } = "TRY";

    [Range(0.000001, double.MaxValue)]
    public decimal Rate { get; set; }

    public DateTime RateDate { get; set; } = DateTime.Today;
}
