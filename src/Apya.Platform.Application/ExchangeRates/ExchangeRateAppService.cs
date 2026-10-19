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

    /// <summary>
    /// Güncelleme varlığın kendi kurallarından geçer ve kaynağı "elle" yapar. Düz eşleme
    /// kuralları (kod normalleştirme, aynı para birimi, sıfır/eksi kur) atlıyor, TCMB'den gelen
    /// kayıt elle değiştirildikten sonra da merkez bankası kuru gibi görünüyordu.
    /// </summary>
    protected override Task MapToEntityAsync(CreateUpdateExchangeRateDto updateInput, ExchangeRate entity)
    {
        entity.SetCurrencies(updateInput.FromCurrency, updateInput.ToCurrency);
        entity.SetRate(updateInput.Rate);
        entity.RateDate = updateInput.RateDate;
        entity.Source = ExchangeRateSource.Manual;
        return Task.CompletedTask;
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
    public async Task<int> SyncFromTcmbAsync(DateTime? date = null)
    {
        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(15);

        // F-06 · Tarih verilirse o günün arşiv bülteni; gelecek tarihin bülteni olmaz.
        if (date.HasValue && date.Value.Date > Clock.Now.Date)
        {
            throw new UserFriendlyException("Gelecek bir tarihin TCMB kuru yok.");
        }
        var url = date.HasValue ? TcmbRateParser.ArchiveUrl(date.Value.Date) : TcmbTodayUrl;

        string xml;
        try
        {
            using var response = await client.GetAsync(url);
            if (date.HasValue && response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                throw new UserFriendlyException(
                    $"{date.Value:dd.MM.yyyy} için TCMB kur yayımlamadı (hafta sonu ya da resmî tatil). " +
                    "Önceki iş gününün kurunu seçin.");
            }
            response.EnsureSuccessStatusCode();
            xml = await response.Content.ReadAsStringAsync();
        }
        catch (UserFriendlyException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new UserFriendlyException("TCMB kurları alınamadı: " + ex.Message);
        }

        // F-06 · ALIŞ kuru ve bültenin KENDİ tarihi (TcmbRateParser); "today" artık bülten günüdür.
        var bulletin = TcmbRateParser.Parse(xml, TcmbCurrencies, date ?? Clock.Now.Date);
        var today = bulletin.Date;
        var count = 0;

        foreach (var (code, rate) in bulletin.BuyingRates)
        {

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
