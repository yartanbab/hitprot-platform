using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.ExchangeRates;

/// <summary>F-06 · TCMB kur bülteninin ham XML'i. Ağ erişimi tek yerde; testler sahte istemci kullanır.</summary>
public interface ITcmbRateClient
{
    /// <summary>
    /// Bugünkü bülten (<paramref name="date"/> boş) ya da o günün arşiv bülteni. Arşivde o gün yoksa (hafta sonu,
    /// resmî tatil) <c>null</c>; ağ hatası istisna fırlatır.
    /// </summary>
    Task<string?> FetchAsync(DateTime? date);
}

public class TcmbRateClient : ITcmbRateClient, ITransientDependency
{
    public const string TodayUrl = "https://www.tcmb.gov.tr/kurlar/today.xml";

    private readonly IHttpClientFactory _httpClientFactory;

    public TcmbRateClient(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<string?> FetchAsync(DateTime? date)
    {
        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(15);

        using var response = await client.GetAsync(date.HasValue ? TcmbRateParser.ArchiveUrl(date.Value.Date) : TodayUrl);
        if (date.HasValue && response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}
