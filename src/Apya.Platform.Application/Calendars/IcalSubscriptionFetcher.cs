using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Calendars;

/// <summary>
/// Abone olunan .ics dosyasını çeker ve önbelleğe alır.
/// <para>
/// Önbellek ZORUNLU: takvim her açılışta 3 aboneliği yeniden indirseydi hem ekran
/// yavaşlar hem de karşı sunucuya gereksiz yük binerdi. Süre kullanıcının seçtiği
/// yenileme sıklığıdır (15 dk / 1 sa / 6 sa / günlük) — "yenileme sıklığı" ayarının
/// gerçek karşılığı budur.
/// </para>
/// </summary>
public class IcalSubscriptionFetcher : ITransientDependency
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IDistributedCache _cache;
    private readonly IcalReader _reader;

    public IcalSubscriptionFetcher(
        IHttpClientFactory httpClientFactory,
        IDistributedCache cache,
        IcalReader reader)
    {
        _httpClientFactory = httpClientFactory;
        _cache             = cache;
        _reader            = reader;
    }

    private static string CacheKey(Guid subscriptionId) => $"ical-sub:{subscriptionId}";

    public async Task<List<CalendarEvent>> FetchAsync(IcalSubscription subscription, DateTime from, DateTime to)
    {
        var content = await _cache.GetStringAsync(CacheKey(subscription.Id));

        if (content == null)
        {
            var client = _httpClientFactory.CreateClient("IcalClient");
            content = await client.GetStringAsync(subscription.Url);

            await _cache.SetStringAsync(
                CacheKey(subscription.Id),
                content,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(subscription.RefreshMinutes)
                });
        }

        return _reader.Read(content, from, to);
    }
}
