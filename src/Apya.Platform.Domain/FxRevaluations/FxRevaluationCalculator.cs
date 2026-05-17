using System;
using Volo.Abp;

namespace Apya.Platform.FxRevaluations;

/// <summary>
/// APYA-138: Bir kasanın bakiyesini yıl-sonu kuruyla TL'ye çevirir. Saf fonksiyon,
/// kur çözümlemesi (AsOfDate'e kadarki en güncel ExchangeRate) AppService'te yapılır.
/// </summary>
public static class FxRevaluationCalculator
{
    public const string BaseCurrency = "TRY";

    public static decimal ToBaseCurrency(decimal balance, string currency, decimal? rate)
    {
        var ccy = (currency ?? string.Empty).Trim();
        if (string.Equals(ccy, BaseCurrency, StringComparison.OrdinalIgnoreCase))
            return balance;

        if (rate is null || rate <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.FxRevaluationRateMissing)
                .WithData("Currency", ccy);

        return Math.Round(balance * rate.Value, 2, MidpointRounding.AwayFromZero);
    }
}
