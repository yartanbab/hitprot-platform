using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.ExchangeRates;

public class ExchangeRateDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string FromCurrency { get; set; } = null!;
    public string ToCurrency { get; set; } = "TRY";
    public decimal Rate { get; set; }
    public DateTime RateDate { get; set; }
    public ExchangeRateSource Source { get; set; }
}
