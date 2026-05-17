using System;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Permissions;

namespace Apya.Platform.ExchangeRates;

[Authorize(PlatformPermissions.ExchangeRates.Default)]
public class ExchangeRateAppService :
    CrudAppService<
        ExchangeRate,
        ExchangeRateDto,
        Guid,
        GetExchangeRatesInput,
        CreateUpdateExchangeRateDto>,
    IExchangeRateAppService
{
    private const string TcmbTodayUrl = "https://www.tcmb.gov.tr/kurlar/today.xml";
    private static readonly string[] TcmbCurrencies = { "USD", "EUR", "GBP" };

    private readonly IHttpClientFactory _httpClientFactory;

    public ExchangeRateAppService(
        IRepository<ExchangeRate, Guid> repository,
        IHttpClientFactory httpClientFactory)
        : base(repository)
    {
        _httpClientFactory = httpClientFactory;
        GetPolicyName = PlatformPermissions.ExchangeRates.Default;
        GetListPolicyName = PlatformPermissions.ExchangeRates.Default;
        CreatePolicyName = PlatformPermissions.ExchangeRates.Create;
        UpdatePolicyName = PlatformPermissions.ExchangeRates.Edit;
        DeletePolicyName = PlatformPermissions.ExchangeRates.Delete;
    }

    protected override async Task<IQueryable<ExchangeRate>> CreateFilteredQueryAsync(GetExchangeRatesInput input)
    {
        var query = await ReadOnlyRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(input.FromCurrency))
        {
            var c = input.FromCurrency.Trim().ToUpperInvariant();
            query = query.Where(x => x.FromCurrency == c);
        }

        if (input.Source.HasValue)
        {
            query = query.Where(x => x.Source == input.Source.Value);
        }

        return query;
    }

    protected override IQueryable<ExchangeRate> ApplyDefaultSorting(IQueryable<ExchangeRate> query)
    {
        return query.OrderByDescending(x => x.RateDate).ThenBy(x => x.FromCurrency);
    }

    [Authorize(PlatformPermissions.ExchangeRates.Create)]
    public async Task<int> SyncFromTcmbAsync()
    {
        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(15);

        string xml;
        try
        {
            xml = await client.GetStringAsync(TcmbTodayUrl);
        }
        catch (Exception ex)
        {
            throw new UserFriendlyException("TCMB kurları alınamadı: " + ex.Message);
        }

        var doc = XDocument.Parse(xml);
        var today = DateTime.Today;
        var count = 0;

        foreach (var code in TcmbCurrencies)
        {
            var node = doc.Descendants("Currency")
                .FirstOrDefault(c => (string?)c.Attribute("CurrencyCode") == code);
            var sellingText = node?.Element("ForexSelling")?.Value;
            if (string.IsNullOrWhiteSpace(sellingText)) continue;
            if (!decimal.TryParse(sellingText, NumberStyles.Any, CultureInfo.InvariantCulture, out var rate) || rate <= 0)
                continue;

            var existing = await Repository.FirstOrDefaultAsync(x =>
                x.FromCurrency == code && x.ToCurrency == "TRY" && x.RateDate == today);

            if (existing == null)
            {
                await Repository.InsertAsync(new ExchangeRate(
                    GuidGenerator.Create(), code, "TRY", rate, today,
                    ExchangeRateSource.Tcmb, CurrentTenant.Id), autoSave: true);
            }
            else
            {
                existing.SetRate(rate);
                existing.Source = ExchangeRateSource.Tcmb;
                await Repository.UpdateAsync(existing, autoSave: true);
            }
            count++;
        }

        return count;
    }
}
