using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Telemetry;
using Volo.Abp;
using Volo.Abp.AuditLogging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Sunucu hatalarını AbpAuditLogs'tan derler. Audit log satırı başına görev açmak
/// anlamsız olurdu — arıza tek, kayıt çok; bu yüzden UÇ bazında toplanır.
/// <para>
/// Uç kimliği <b>HTTP metodu + normalize yol</b>'dur (bkz.
/// <see cref="EndpointUrlNormalizer"/>): <c>/Projects/ProjectDetails/{id}</c> tek
/// arızadır — aynı hata 200 projede patlasa da tek görev açar.
/// </para>
/// Hem panel (elle dönüştürme) hem otomatik kural aynı derlemeyi kullanır.
/// </summary>
public class ServerErrorSignalBuilder : DomainService
{
    /// <summary>Tek sinyal derlenirken ön-daraltmadan sonra taranan en fazla satır.</summary>
    private const int ScanLimit = 500;

    private readonly IRepository<AuditLog, Guid> _auditLogRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;
    private readonly IClock _clock;

    public ServerErrorSignalBuilder(
        IRepository<AuditLog, Guid> auditLogRepository,
        IDataFilter<IMultiTenant> multiTenantFilter,
        IClock clock)
    {
        _auditLogRepository = auditLogRepository;
        _multiTenantFilter = multiTenantFilter;
        _clock = clock;
    }

    /// <summary>
    /// Verilen ucun (metot + normalize yol) pencere içindeki hatalarını tek sinyale
    /// indirger; hiç yoksa null.
    /// </summary>
    public async Task<ServerErrorSignal?> BuildAsync(string url, string? httpMethod, int windowDays)
    {
        var since = _clock.Now.AddDays(-NormalizeWindow(windowDays));

        // Worker host bağlamında koşar; filtre açık kalırsa yalnız TenantId=null
        // satırlar görünür ve kiracı hataları hiç sayılmaz.
        using (_multiTenantFilter.Disable())
        {
            var query = FailedRequests(await _auditLogRepository.GetQueryableAsync(), since);

            if (!httpMethod.IsNullOrWhiteSpace())
            {
                query = query.Where(a => a.HttpMethod == httpMethod);
            }

            // Normalize yol ham satırlarla EŞİT DEĞİLDİR; SQL yalnız sabit önekle
            // daraltır, tam eşleştirme aşağıda bellekte yapılır.
            var prefix = EndpointUrlNormalizer.LiteralPrefix(url);
            if (prefix.Length > 0)
            {
                query = query.Where(a => a.Url != null && a.Url.StartsWith(prefix));
            }

            var scanned = await AsyncExecuter.ToListAsync(
                query.OrderByDescending(a => a.ExecutionTime)
                    .Take(ScanLimit)
                    .Select(a => new Row
                    {
                        RawUrl = a.Url,
                        ExecutionTime = a.ExecutionTime,
                        HttpMethod = a.HttpMethod,
                        HttpStatusCode = a.HttpStatusCode,
                        Exceptions = a.Exceptions,
                        TenantId = a.TenantId,
                        TenantName = a.TenantName
                    }));

            var rows = scanned
                .Where(r => EndpointUrlNormalizer.Normalize(r.RawUrl) == url)
                .ToList();

            if (rows.Count == 0)
            {
                return null;
            }

            var newest = rows[0];

            // En çok etkilenen kiracı — "kime sorulacak" sorusunun cevabı.
            var topTenant = rows
                .GroupBy(r => new { r.TenantId, r.TenantName })
                .OrderByDescending(g => g.Count())
                .First();

            return new ServerErrorSignal
            {
                Url             = url,
                HttpMethod      = httpMethod.IsNullOrWhiteSpace() ? newest.HttpMethod : httpMethod,
                ExceptionText   = newest.Exceptions,
                ExceptionType   = ExtractExceptionType(newest.Exceptions),
                HttpStatusCode  = newest.HttpStatusCode,
                OccurrenceCount = rows.Count,
                FirstSeenAt     = rows.Min(r => r.ExecutionTime),
                LastSeenAt      = newest.ExecutionTime,
                TenantId        = topTenant.Key.TenantId,
                TenantName      = topTenant.Key.TenantId == null ? "Host" : topTenant.Key.TenantName
            };
        }
    }

    /// <summary>
    /// Pencere içinde en az <paramref name="minOccurrences"/> kez patlayan UÇLAR.
    /// Eşik normalize uca uygulanır: aynı rotanın farklı kimlikli 200 kaydı tek
    /// arızadır — eskiden hiçbiri tek başına eşiği geçemiyordu.
    /// </summary>
    public async Task<List<FailingEndpoint>> FindFailingEndpointsAsync(int windowDays, int minOccurrences, int maxResults)
    {
        var since = _clock.Now.AddDays(-NormalizeWindow(windowDays));

        using (_multiTenantFilter.Disable())
        {
            var raw = await AsyncExecuter.ToListAsync(
                FailedRequests(await _auditLogRepository.GetQueryableAsync(), since)
                    .Where(a => a.Url != null && a.Url != "")
                    .GroupBy(a => new { a.HttpMethod, a.Url })
                    .Select(g => new RawEndpointCount
                    {
                        HttpMethod = g.Key.HttpMethod,
                        Url = g.Key.Url!,
                        ErrorCount = g.Count()
                    })
                    // Yola göre KARARLI sıra: sayıya göre kesmek, kimlik taşıyan
                    // yolları (her biri 1-2 hata) eler — normalize edildiğinde eşiği
                    // birlikte geçecek olanlar tam da onlar.
                    .OrderBy(r => r.Url).ThenBy(r => r.HttpMethod)
                    .Take(TelemetryConsts.MaxEndpointGroupsScanned));

            return raw
                .GroupBy(r => new
                {
                    Method = r.HttpMethod ?? string.Empty,
                    Url    = EndpointUrlNormalizer.Normalize(r.Url)
                })
                .Select(g => new FailingEndpoint
                {
                    HttpMethod = g.Key.Method.Length == 0 ? null : g.Key.Method,
                    Url        = g.Key.Url,
                    ErrorCount = g.Sum(x => x.ErrorCount)
                })
                .Where(e => e.ErrorCount >= minOccurrences)
                .OrderByDescending(e => e.ErrorCount)
                .Take(maxResults)
                .ToList();
        }
    }

    /// <summary>
    /// Hata sayılan istek: exception yazılmış ya da 5xx dönmüş olan — <b>4xx hariç</b>.
    /// <para>
    /// ABP ele alınmış istisnaları da audit satırının <c>Exceptions</c> alanına yazar
    /// (403 yetki · 404 bulunamadı · 400 doğrulama). Bunlar dışlanmazsa otomasyon
    /// işçisi eşiği aşan bir 403 ucundan KENDİLİĞİNDEN "sunucu hatası" görevi açar —
    /// oysa ortada bir arıza yoktur. Ölçüt Sistem Sağlığı'ndaki
    /// <c>SystemHealthAppService.FailedRequests</c> ile aynı tutulmalıdır.
    /// </para>
    /// </summary>
    private static IQueryable<AuditLog> FailedRequests(IQueryable<AuditLog> query, DateTime since)
    {
        return query
            .Where(a => a.ExecutionTime >= since)
            .Where(a => ((a.Exceptions != null && a.Exceptions != "")
                         || (a.HttpStatusCode != null && a.HttpStatusCode >= 500))
                        && (a.HttpStatusCode == null
                            || a.HttpStatusCode < 400
                            || a.HttpStatusCode >= 500));
    }

    /// <summary>"Volo.Abp.BusinessException: mesaj..." → "Volo.Abp.BusinessException".</summary>
    public static string? ExtractExceptionType(string? exceptions)
    {
        if (string.IsNullOrWhiteSpace(exceptions))
        {
            return null;
        }

        var firstLine = exceptions!.Split('\n')[0].Trim();
        var colon = firstLine.IndexOf(':');
        return colon > 0 ? firstLine[..colon].Trim() : firstLine;
    }

    private static int NormalizeWindow(int windowDays) => windowDays <= 0 ? 7 : windowDays;

    /// <summary>Audit log projeksiyonunun hedefi — ağır alanlar (Actions, Entity changes) taşınmaz.</summary>
    private sealed class Row
    {
        public string? RawUrl { get; set; }
        public DateTime ExecutionTime { get; set; }
        public string? HttpMethod { get; set; }
        public int? HttpStatusCode { get; set; }
        public string? Exceptions { get; set; }
        public Guid? TenantId { get; set; }
        public string? TenantName { get; set; }
    }

    /// <summary>Normalizasyon öncesi ham yol sayımı (SQL projeksiyon hedefi).</summary>
    private sealed class RawEndpointCount
    {
        public string? HttpMethod { get; set; }
        public string Url { get; set; } = string.Empty;
        public int ErrorCount { get; set; }
    }
}

/// <summary>Eşiği geçmiş, göreve dönüştürülmeye aday bir uç.</summary>
public class FailingEndpoint
{
    public string? HttpMethod { get; set; }

    /// <summary>Normalize yol — ör. <c>/api/app/project/{id}</c>.</summary>
    public string Url { get; set; } = string.Empty;

    public int ErrorCount { get; set; }
}
