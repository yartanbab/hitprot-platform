using Volo.Abp.Application.Dtos;

namespace Apya.Platform.ExchangeRates;

public class GetExchangeRatesInput : PagedAndSortedResultRequestDto
{
    public string? FromCurrency { get; set; }
    public ExchangeRateSource? Source { get; set; }
}
