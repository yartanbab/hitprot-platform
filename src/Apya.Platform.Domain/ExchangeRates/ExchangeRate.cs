using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ExchangeRates;

/// <summary>
/// Kur kaydı (APYA-137). 1 <see cref="FromCurrency"/> = <see cref="Rate"/> <see cref="ToCurrency"/>.
/// APYA-136 (Invoice→CashMovement) ve APYA-138 (yıl sonu değerleme) bu kuru kullanır.
/// Tenant-scoped — tenant kendi anlaştığı kuru da girebilir; TCMB kaynaklı kayıtlar Source=Tcmb.
/// </summary>
public class ExchangeRate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string FromCurrency { get; set; } = null!;
    public string ToCurrency { get; set; } = "TRY";
    public decimal Rate { get; set; }
    public DateTime RateDate { get; set; }
    public ExchangeRateSource Source { get; set; } = ExchangeRateSource.Manual;

    protected ExchangeRate() { }

    public ExchangeRate(
        Guid id,
        string fromCurrency,
        string toCurrency,
        decimal rate,
        DateTime rateDate,
        ExchangeRateSource source = ExchangeRateSource.Manual,
        Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        SetCurrencies(fromCurrency, toCurrency);
        SetRate(rate);
        RateDate = rateDate.Date;
        Source = source;
    }

    public void SetCurrencies(string fromCurrency, string toCurrency)
    {
        var from = Normalize(fromCurrency);
        var to = Normalize(toCurrency);
        if (from == to)
            throw new BusinessException(PlatformDomainErrorCodes.ExchangeRateSameCurrency)
                .WithData("Currency", from);
        FromCurrency = from;
        ToCurrency = to;
    }

    public void SetRate(decimal rate)
    {
        if (rate <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.ExchangeRateInvalid)
                .WithData("Rate", rate);
        Rate = rate;
    }

    private static string Normalize(string currency)
    {
        if (string.IsNullOrWhiteSpace(currency) || currency.Trim().Length != ExchangeRateConsts.CurrencyLength)
            throw new BusinessException(PlatformDomainErrorCodes.ExchangeRateCurrencyInvalid)
                .WithData("Currency", currency ?? string.Empty);
        return currency.Trim().ToUpperInvariant();
    }
}
