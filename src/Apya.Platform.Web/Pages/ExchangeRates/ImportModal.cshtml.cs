using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.ExchangeRates;

/// <summary>
/// Kurları Excel'den içe aktarır. Her satır "Yeni Kur Ekle" penceresinin servisinden
/// (<see cref="IExchangeRateAppService.CreateAsync"/>) geçer ve elle girilmiş kur olarak kaydedilir.
/// Seçenek listesi yok; istek boyu durum yalnız dosyada görülen (çift, tarih) anahtarları.
/// </summary>
[Authorize(PlatformPermissions.ExchangeRates.Create)]
public class ImportModalModel : ExcelImportPageModel<HashSet<string>, CreateUpdateExchangeRateDto>
{
    private readonly IExchangeRateAppService _exchangeRateAppService;

    public ImportModalModel(IExchangeRateAppService exchangeRateAppService)
    {
        _exchangeRateAppService = exchangeRateAppService;
    }

    protected override string NameKey => "Import:ExchangeRates:Name";

    private sealed record Headers(string Date, string From, string To, string Rate);

    private Headers H => new(L["Export:Col:Date"], L["Export:Col:Currency"], L["Import:Col:ToCurrency"], L["Import:Col:Rate"]);

    protected override IReadOnlyList<ImportColumn> Columns(HashSet<string> seen)
    {
        var h = H;
        var currencies = FinanceLookupShared.Currencies().Select(c => c.Value).ToList();
        return
        [
            new(h.Date, Required: true),
            new(h.From, Required: true, Options: currencies),
            new(h.To, Options: currencies),
            new(h.Rate, Required: true),
        ];
    }

    protected override Task<HashSet<string>> LoadLookupsAsync() => Task.FromResult(new HashSet<string>());

    protected override Task<CreateUpdateExchangeRateDto> MapAsync(ImportRow row, HashSet<string> seen)
    {
        var h = H;
        var result = new CreateUpdateExchangeRateDto();

        var date = ExcelImport.Date(row.Value(h.Date));
        if (date == null) row.Errors.Add(row.Text(h.Date).Length == 0 ? L["Import:Error:Required", h.Date] : L["Import:Error:Date", h.Date]);
        else result.RateDate = date.Value.Date;

        result.FromCurrency = Currency(row, h.From, row.Text(h.From));
        result.ToCurrency = Currency(row, h.To, row.Text(h.To) is { Length: > 0 } to ? to : "TRY");
        if (result.FromCurrency.Length > 0 && result.FromCurrency == result.ToCurrency)
        {
            row.Errors.Add(L["Import:Error:SameCurrency", h.From, h.To]);
        }

        // Metin kurda tek nokta ondalıktır ("1.085" = 1,085): kurda binlik ayıracı neredeyse hiç
        // görülmez, genel kural ise bunu 1085 okurdu — sessiz bin kat hata.
        var rawRate = row.Value(h.Rate);
        var rate = rawRate is string s && Regex.IsMatch(s.Trim(), @"^\d+\.\d+$")
            ? decimal.Parse(s.Trim(), CultureInfo.InvariantCulture)
            : ExcelImport.Decimal(rawRate);
        if (rate == null) row.Errors.Add(row.Text(h.Rate).Length == 0 ? L["Import:Error:Required", h.Rate] : L["Import:Error:Number", h.Rate]);
        else if (rate <= 0) row.Errors.Add(L["Import:Error:Positive", h.Rate]);
        else result.Rate = Math.Round(rate.Value, 6);

        // Aynı gün için iki kur, "en güncel kayıt" kuralında hangisinin kullanılacağını belirsiz bırakır.
        if (date != null && row.Errors.Count == 0
            && !seen.Add($"{result.FromCurrency}/{result.ToCurrency}/{result.RateDate:yyyy-MM-dd}"))
        {
            row.Errors.Add(L["Import:Error:Duplicate", h.Date, $"{result.FromCurrency}/{result.ToCurrency} {result.RateDate:dd.MM.yyyy}"]);
        }

        return Task.FromResult(result);
    }

    private string Currency(ImportRow row, string header, string text)
    {
        var code = text.Trim().ToUpperInvariant();
        if (code.Length == 0)
        {
            row.Errors.Add(L["Import:Error:Required", header]);
            return string.Empty;
        }

        if (!Regex.IsMatch(code, "^[A-Z]{3}$")) row.Errors.Add(L["Import:Error:Currency", header]);
        return code;
    }

    protected override Task CreateAsync(CreateUpdateExchangeRateDto row) => _exchangeRateAppService.CreateAsync(row);
}
