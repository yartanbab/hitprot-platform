using System;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Bir tutarın diğer defterlerdeki karşılığı. SAF fonksiyon — kur çözümlemesi
/// (hangi günün kuru, hangi kayıt) dışarıda yapılır.
///
/// Mevcut <c>PaymentCashConverter</c> ve <c>FxRevaluationCalculator</c> ile aynı
/// desen: dönüşüm burada, veri erişimi app service'te.
/// </summary>
public static class FxLedgerCalculator
{
    public const string BookCurrency = "TRY";

    /// <summary>Aynı para birimindeyse kur aranmaz; farklıysa kur ZORUNLU.</summary>
    public static decimal Convert(decimal amount, string fromCurrency, string toCurrency, decimal? rate)
    {
        var from = (fromCurrency ?? string.Empty).Trim();
        var to = (toCurrency ?? string.Empty).Trim();

        if (string.Equals(from, to, StringComparison.OrdinalIgnoreCase))
        {
            return amount;
        }

        if (rate is null || rate <= 0)
            throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.FxRateMissing)
                .WithData("From", from)
                .WithData("To", to);

        return Math.Round(amount * rate.Value, 2, MidpointRounding.AwayFromZero);
    }

    /// <summary>
    /// Aynı para biriminde kur her zaman 1'dir. Bunu çağıranların tek tek
    /// hatırlaması gerekmesin diye burada.
    /// </summary>
    public static decimal EffectiveRate(string fromCurrency, string toCurrency, decimal? rate)
        => string.Equals((fromCurrency ?? string.Empty).Trim(), (toCurrency ?? string.Empty).Trim(),
            StringComparison.OrdinalIgnoreCase)
            ? 1m
            : rate ?? 0m;
}
