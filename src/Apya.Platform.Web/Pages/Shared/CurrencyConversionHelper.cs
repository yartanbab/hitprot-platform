using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ExchangeRates;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// Gösterim amaçlı ₺-karşılığı toplamlar için (Finans Hub, Kasa &amp; Banka).
/// Gerçek finansal işlemler (transfer, tahsilat) kendi kur çözümlemesini
/// yapar (bkz. CashTransferManager, InvoiceManager) — burası salt-okunur
/// dashboard toplamları içindir, kur bulunamazsa sessizce o hesabı ₺
/// toplamına katmaz (hata fırlatmaz).
/// </summary>
public static class CurrencyConversionHelper
{
    /// <summary>Her para birimi için TRY'ye en güncel kur (FromCurrency → Rate).</summary>
    public static async Task<Dictionary<string, decimal>> LoadRatesToTryAsync(IExchangeRateAppService exchangeRateAppService)
    {
        var result = await exchangeRateAppService.GetListAsync(new GetExchangeRatesInput
        {
            MaxResultCount = 1000,
            Sorting = "RateDate desc"
        });

        return result.Items
            .Where(x => string.Equals(x.ToCurrency, "TRY", StringComparison.OrdinalIgnoreCase))
            .GroupBy(x => x.FromCurrency.Trim().ToUpperInvariant())
            .ToDictionary(g => g.Key, g => g.OrderByDescending(x => x.RateDate).First().Rate);
    }

    /// <summary>Kur bulunamazsa 0 döner (toplama dahil edilmez) — dashboard toplamı hata vermesin.</summary>
    public static decimal ToTry(decimal amount, string currency, Dictionary<string, decimal> ratesToTry)
    {
        var cur = (currency ?? string.Empty).Trim().ToUpperInvariant();
        if (cur == "TRY") return amount;
        return ratesToTry.TryGetValue(cur, out var rate) ? Math.Round(amount * rate, 2) : 0m;
    }
}
