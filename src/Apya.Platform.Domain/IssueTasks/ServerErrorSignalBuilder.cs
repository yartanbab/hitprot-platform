using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.AuditLogging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Sunucu hatalarını AbpAuditLogs'tan derler. Audit log satırı başına görev açmak
/// anlamsız olurdu — arıza tek, kayıt çok; bu yüzden URL bazında toplanır.
/// Hem panel (elle dönüştürme) hem otomatik kural aynı derlemeyi kullanır.
/// </summary>
public class ServerErrorSignalBuilder : DomainService
{
    /// <summary>Tek sinyal derlenirken taranan en fazla satır.</summary>
    private const int ScanLimit = 200;

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

    /// <summary>Verilen URL'in pencere içindeki hatalarını tek sinyale indirger; hiç yoksa null.</summary>
    public async Task<ServerErrorSignal?> BuildAsync(string url, int windowDays)
    {
        var since = _clock.Now.AddDays(-NormalizeWindow(windowDays));

        // Worker host bağlamında koşar; filtre açık kalırsa yalnız TenantId=null
        // satırlar görünür ve kiracı hataları hiç sayılmaz.
        using (_multiTenantFilter.Disable())
        {
            var rows = await AsyncExecuter.ToListAsync(
                FailedRequests(await _auditLogRepository.GetQueryableAsync(), since)
                    .Where(a => a.Url == url)
                    .OrderByDescending(a => a.ExecutionTime)
                    .Take(ScanLimit)
                    .Select(a => new Row
                    {
                        ExecutionTime = a.ExecutionTime,
                        HttpMethod = a.HttpMethod,
                        HttpStatusCode = a.HttpStatusCode,
                        Exceptions = a.Exceptions,
                        TenantId = a.TenantId,
                        TenantName = a.TenantName
                    }));

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
                ExceptionText   = newest.Exceptions,
                ExceptionType   = ExtractExceptionType(newest.Exceptions),
                HttpMethod      = newest.HttpMethod,
                HttpStatusCode  = newest.HttpStatusCode,
                OccurrenceCount = rows.Count,
                FirstSeenAt     = rows.Min(r => r.ExecutionTime),
                LastSeenAt      = newest.ExecutionTime,
                TenantId        = topTenant.Key.TenantId,
                TenantName      = topTenant.Key.TenantId == null ? "Host" : topTenant.Key.TenantName
            };
        }
    }

    /// <summary>Pencere içinde en az <paramref name="minOccurrences"/> kez patlayan URL'ler.</summary>
    public async Task<List<string>> FindFailingUrlsAsync(int windowDays, int minOccurrences, int maxResults)
    {
        var since = _clock.Now.AddDays(-NormalizeWindow(windowDays));

        using (_multiTenantFilter.Disable())
        {
            return await AsyncExecuter.ToListAsync(
                FailedRequests(await _auditLogRepository.GetQueryableAsync(), since)
                    .Where(a => a.Url != null && a.Url != "")
                    .GroupBy(a => a.Url!)
                    .Where(g => g.Count() >= minOccurrences)
                    .OrderByDescending(g => g.Count())
                    .Take(maxResults)
                    .Select(g => g.Key));
        }
    }

    /// <summary>Hata sayılan istek: exception yazılmış ya da 5xx dönmüş olan.</summary>
    private static IQueryable<AuditLog> FailedRequests(IQueryable<AuditLog> query, DateTime since)
    {
        return query
            .Where(a => a.ExecutionTime >= since)
            .Where(a => (a.Exceptions != null && a.Exceptions != "")
                        || (a.HttpStatusCode != null && a.HttpStatusCode >= 500));
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
        public DateTime ExecutionTime { get; set; }
        public string? HttpMethod { get; set; }
        public int? HttpStatusCode { get; set; }
        public string? Exceptions { get; set; }
        public Guid? TenantId { get; set; }
        public string? TenantName { get; set; }
    }
}
