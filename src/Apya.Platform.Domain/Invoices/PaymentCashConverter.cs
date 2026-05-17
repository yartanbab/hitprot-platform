using System;
using Volo.Abp;

namespace Apya.Platform.Invoices;

/// <summary>
/// APYA-136: Fatura tahsilatını, ödendiği kasanın para birimine çevirir.
/// Saf fonksiyon — kur çözümlemesi (en güncel ExchangeRate) AppService'te yapılır,
/// uygulama mantığı burada test edilebilir biçimde izole.
/// </summary>
public static class PaymentCashConverter
{
    /// <param name="amount">Fatura para biriminde ödenen tutar.</param>
    /// <param name="invoiceCurrency">Fatura para birimi.</param>
    /// <param name="cashCurrency">Kasanın para birimi.</param>
    /// <param name="rate">1 invoiceCurrency = rate cashCurrency. Aynı para biriminde önemsiz; farklıysa zorunlu.</param>
    public static decimal ToCashCurrency(decimal amount, string invoiceCurrency, string cashCurrency, decimal? rate)
    {
        var from = (invoiceCurrency ?? string.Empty).Trim();
        var to = (cashCurrency ?? string.Empty).Trim();

        if (string.Equals(from, to, StringComparison.OrdinalIgnoreCase))
            return amount;

        if (rate is null || rate <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.PaymentExchangeRateMissing)
                .WithData("From", from)
                .WithData("To", to);

        return Math.Round(amount * rate.Value, 2, MidpointRounding.AwayFromZero);
    }
}
