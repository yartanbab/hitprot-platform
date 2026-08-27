using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.AuditLogging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Host'un teşhis paneli. Sunucu tarafı metrikler yeni bir tablo AÇMADAN, zaten
/// toplanan AbpAuditLogs üzerinden türetilir. İstemci tarafı ise ClientError'dan gelir.
/// </summary>
[Authorize(PlatformPermissions.SystemHealth.Default)]
public partial class SystemHealthAppService : ApplicationService, ISystemHealthAppService
{
    private const int TopPagesCount = 10;
    private const int SlowestEndpointsCount = 10;
    private const int TopTenantsCount = 10;

    /// <summary>Yavaşlık ölçütü — çağrı bu süreyi aşarsa "yavaş" sayılır.</summary>
    private const int SlowThresholdMs = TelemetryConsts.DefaultSlowEndpointThresholdMs;

    /// <summary>
    /// Tek bir ucun detayı derlenirken ön-daraltmadan sonra bellekte eşleştirilecek
    /// en fazla satır. Normalize yol ham satırlarla eşit olmadığı için tam eşleştirme
    /// bellekte tamamlanır (bkz. <see cref="ApplyEndpointFilter"/>).
    /// </summary>
    private const int EndpointMatchScanLimit = 2_000;

    private readonly IRepository<AuditLog, Guid> _auditLogRepository;
    private readonly IRepository<ClientError, Guid> _clientErrorRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public SystemHealthAppService(
        IRepository<AuditLog, Guid> auditLogRepository,
        IRepository<ClientError, Guid> clientErrorRepository,
        ITenantRepository tenantRepository,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _auditLogRepository = auditLogRepository;
        _clientErrorRepository = clientErrorRepository;
        _tenantRepository = tenantRepository;
        _multiTenantFilter = multiTenantFilter;
    }

    public async Task<SystemHealthDto> GetAsync(int windowDays = 7)
    {
        EnsureHostContext();

        var days = windowDays <= 0 ? 7 : windowDays;
        var since = Clock.Now.AddDays(-days);

        using (_multiTenantFilter.Disable())
        {
            var auditQuery = (await _auditLogRepository.GetQueryableAsync())
                .Where(a => a.ExecutionTime >= since);

            // Toplam sayaçlar AYRI ve tamdır: uç gruplamasının tavanı (grup sayısı)
            // bunları etkilemesin. Eskiden ikisi de aynı 200.000 satırlık bellek
            // taramasından çıkıyordu ve pencere büyükse eksik sayıyordu.
            var totalCount = await AsyncExecuter.CountAsync(auditQuery);
            var errorCount = await AsyncExecuter.CountAsync(FailedRequests(auditQuery));

            var endpoints = await GetEndpointStatsAsync(auditQuery);

            return new SystemHealthDto
            {
                WindowDays           = days,
                SlowThresholdMs      = SlowThresholdMs,
                EndpointMinCallCount = TelemetryConsts.DefaultEndpointMinCallCount,

                UnresolvedClientErrorCount     = await CountUnresolvedClientErrorsAsync(),
                ClientErrorOccurrencesInWindow = await SumClientErrorOccurrencesAsync(since),

                ServerRequestCount = totalCount,
                ServerErrorCount   = errorCount,
                ServerErrorRate    = Rate(errorCount, totalCount),

                TopFailingPages = endpoints
                    .Where(e => e.ErrorCount > 0)
                    .OrderByDescending(e => e.ErrorCount)
                    .Take(TopPagesCount)
                    .Select(e => new HealthPageStatDto
                    {
                        Url        = e.Url,
                        HttpMethod = e.HttpMethod,
                        TotalCount = e.CallCount,
                        ErrorCount = e.ErrorCount,
                        ErrorRate  = e.ErrorRate
                    })
                    .ToList(),

                // Min çağrı eşiği: tek kez çağrılmış soğuk bir uç (ör. ilk istekte
                // JIT/ısınma) eskiden listeyi kapatıyor, gerçek darboğaz görünmüyordu.
                SlowestEndpoints = endpoints
                    .Where(e => e.CallCount >= TelemetryConsts.DefaultEndpointMinCallCount)
                    .OrderByDescending(e => e.AverageDurationMs)
                    .Take(SlowestEndpointsCount)
                    .ToList(),

                ErrorTrend           = await BuildErrorTrendAsync(auditQuery, since),
                ErrorsByTenant       = await GetTenantStatsAsync(auditQuery, since),
                ClientErrorsBySource = await GetClientErrorsBySourceAsync(since),
                TenantOptions        = await GetTenantOptionsAsync()
            };
        }
    }

    public async Task<List<ServerErrorDetailDto>> GetServerErrorsAsync(GetServerErrorListInput input)
    {
        EnsureHostContext();

        var days = input.WindowDays <= 0 ? 7 : input.WindowDays;
        var take = Math.Clamp(input.MaxResultCount, 1, 200);
        var since = Clock.Now.AddDays(-days);

        using (_multiTenantFilter.Disable())
        {
            var query = FailedRequests((await _auditLogRepository.GetQueryableAsync())
                .Where(a => a.ExecutionTime >= since));

            var rows = await AsyncExecuter.ToListAsync(
                ApplyEndpointFilter(query, input.Url, input.HttpMethod)
                     .OrderByDescending(a => a.ExecutionTime)
                     .Take(EndpointMatchScanLimit)
                     .Select(a => new ServerErrorDetailDto
                     {
                         Url = a.Url,
                         ExecutionTime = a.ExecutionTime,
                         ExecutionDuration = a.ExecutionDuration,
                         HttpStatusCode = a.HttpStatusCode,
                         HttpMethod = a.HttpMethod,
                         UserName = a.UserName,
                         TenantName = a.TenantId == null ? "Host" : a.TenantName,
                         ClientIpAddress = a.ClientIpAddress,
                         BrowserInfo = a.BrowserInfo,
                         Exceptions = a.Exceptions
                     }));

            // Ön-daraltma yalnız öneke bakar; aynı önekle başlayan BAŞKA uçlar da
            // gelebilir ("/api/app/task" ↔ "/api/app/taskitem"). Tam eşleştirme burada.
            return rows
                .Where(r => EndpointUrlNormalizer.Normalize(r.Url) == input.Url)
                .Take(take)
                .ToList();
        }
    }

    public async Task<PagedResultDto<ClientErrorDto>> GetClientErrorsAsync(GetClientErrorListInput input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var query = (await _clientErrorRepository.GetQueryableAsync());

            if (input.IsResolved.HasValue)
            {
                query = query.Where(e => e.IsResolved == input.IsResolved.Value);
            }

            if (input.Source.HasValue)
            {
                query = query.Where(e => e.Source == input.Source.Value);
            }

            if (input.HostOnly)
            {
                query = query.Where(e => e.TenantId == null);
            }
            else if (input.TenantId.HasValue)
            {
                query = query.Where(e => e.TenantId == input.TenantId.Value);
            }

            if (!input.Filter.IsNullOrWhiteSpace())
            {
                var term = input.Filter!.Trim();
                query = query.Where(e => e.Message.Contains(term) || (e.PageUrl != null && e.PageUrl.Contains(term)));
            }

            var totalCount = await AsyncExecuter.CountAsync(query);

            var items = await AsyncExecuter.ToListAsync(
                query.OrderByDescending(e => e.LastSeenAt)
                     .Skip(input.SkipCount)
                     .Take(input.MaxResultCount));

            var tenantNames = await GetTenantNamesAsync();
            var dtos = items.Select(e => MapToDto(e, tenantNames)).ToList();

            return new PagedResultDto<ClientErrorDto>(totalCount, dtos);
        }
    }

    public async Task<ClientErrorDto> GetClientErrorAsync(Guid id)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var entity = await _clientErrorRepository.FindAsync(id);
            if (entity is null)
            {
                throw new EntityNotFoundException(typeof(ClientError), id);
            }

            var tenantNames = await GetTenantNamesAsync();
            return MapToDto(entity, tenantNames);
        }
    }

    [Authorize(PlatformPermissions.SystemHealth.Resolve)]
    public async Task SetClientErrorResolvedAsync(Guid id, bool isResolved)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var entity = await _clientErrorRepository.GetAsync(id);

            if (isResolved)
            {
                entity.MarkResolved(Clock.Now);
            }
            else
            {
                entity.IsResolved = false;
                entity.ResolvedAt = null;
            }

            await _clientErrorRepository.UpdateAsync(entity);
        }
    }

    /* ─── Yardımcılar ─────────────────────────────────────────────────────── */

    private async Task<int> CountUnresolvedClientErrorsAsync()
    {
        var query = (await _clientErrorRepository.GetQueryableAsync()).Where(e => !e.IsResolved);
        return await AsyncExecuter.CountAsync(query);
    }

    /// <summary>
    /// Yaklaşık değer: yaşam boyu oluşum sayısının tamamı değil, yalnızca pencere
    /// içinde EN SON görülenlerin toplamı. Tam geçmiş tutulmadığı için (bkz. ClientError
    /// yorumu) bu, "pencerede aktif olan hata hacmi" için kabul edilebilir bir yaklaşıklık.
    /// </summary>
    private async Task<int> SumClientErrorOccurrencesAsync(DateTime since)
    {
        var query = (await _clientErrorRepository.GetQueryableAsync()).Where(e => e.LastSeenAt >= since);
        var counts = await AsyncExecuter.ToListAsync(query.Select(e => e.OccurrenceCount));
        return counts.Sum();
    }

    /// <summary>
    /// Kaynak kırılımı (JS / Promise / AJAX). "Hangi tür hata baskın" sorusunu
    /// cevaplar; pencere ölçütü SumClientErrorOccurrencesAsync ile aynıdır
    /// (son görülme pencere içinde).
    /// </summary>
    private async Task<List<HealthSourceStatDto>> GetClientErrorsBySourceAsync(DateTime since)
    {
        var query = (await _clientErrorRepository.GetQueryableAsync())
            .Where(e => e.LastSeenAt >= since);

        var rows = await AsyncExecuter.ToListAsync(
            query.Select(e => new { e.Source, e.OccurrenceCount, e.IsResolved }));

        return rows
            .GroupBy(r => r.Source)
            .Select(g => new HealthSourceStatDto
            {
                Source = g.Key,
                ErrorCount = g.Count(),
                OccurrenceCount = g.Sum(x => x.OccurrenceCount),
                UnresolvedCount = g.Count(x => !x.IsResolved)
            })
            .OrderByDescending(s => s.OccurrenceCount)
            .ToList();
    }

    /// <summary>Filtre açılır listesi — hata üretmemiş tenant da seçilebilmeli.</summary>
    private async Task<List<HealthTenantOptionDto>> GetTenantOptionsAsync()
    {
        var tenants = await _tenantRepository.GetListAsync();

        var options = new List<HealthTenantOptionDto>
        {
            new() { TenantId = null, Name = "Host" }
        };

        options.AddRange(tenants
            .OrderBy(t => t.Name)
            .Select(t => new HealthTenantOptionDto { TenantId = t.Id, Name = t.Name }));

        return options;
    }

    private async Task<Dictionary<Guid, string>> GetTenantNamesAsync()
    {
        var tenants = await _tenantRepository.GetListAsync();
        return tenants.ToDictionary(t => t.Id, t => t.Name);
    }

    private static ClientErrorDto MapToDto(ClientError entity, Dictionary<Guid, string> tenantNames)
    {
        return new ClientErrorDto
        {
            Id = entity.Id,
            Fingerprint = entity.Fingerprint,
            Source = entity.Source,
            Message = entity.Message,
            StackTrace = entity.StackTrace,
            PageUrl = entity.PageUrl,
            UserAgent = entity.UserAgent,
            ScreenResolution = entity.ScreenResolution,
            AppVersion = entity.AppVersion,
            BreadcrumbJson = entity.BreadcrumbJson,
            OccurrenceCount = entity.OccurrenceCount,
            FirstSeenAt = entity.FirstSeenAt,
            LastSeenAt = entity.LastSeenAt,
            LastUserId = entity.LastUserId,
            IsResolved = entity.IsResolved,
            ResolvedAt = entity.ResolvedAt,
            TenantId = entity.TenantId,
            TenantName = entity.TenantId == null
                ? "Host"
                : (tenantNames.TryGetValue(entity.TenantId.Value, out var name) ? name : null)
        };
    }

    /* ─── Audit toplama — gruplama SQL'de yapılır ──────────────────────────── */

    /// <summary>Hata sayılan istek: exception yazılmış ya da 5xx dönmüş olan.</summary>
    private static IQueryable<AuditLog> FailedRequests(IQueryable<AuditLog> query)
    {
        return query.Where(a => (a.Exceptions != null && a.Exceptions != "")
                                || (a.HttpStatusCode != null && a.HttpStatusCode >= 500));
    }

    /// <summary>
    /// Uç istatistikleri. Gruplama SQL'de HAM yola göre yapılır (ucuz); dönen küçük
    /// küme bellekte normalize edilip YENİDEN gruplanır. Böylece
    /// <c>/Projects/ProjectDetails/{id}</c> tek uçtur — 200 projeyi açan kullanıcı
    /// 200 ayrı "yavaş uç" üretmez.
    /// </summary>
    private async Task<List<HealthEndpointStatDto>> GetEndpointStatsAsync(IQueryable<AuditLog> auditQuery)
    {
        var rows = await AsyncExecuter.ToListAsync(
            auditQuery
                .Where(a => a.Url != null && a.Url != "")
                .GroupBy(a => new { a.HttpMethod, a.Url })
                .Select(g => new EndpointGroupRow
                {
                    HttpMethod = g.Key.HttpMethod,
                    Url        = g.Key.Url!,
                    CallCount  = g.Count(),
                    // (long): Postgres SUM(int)→bigint döner, SQL Server'da int taşabilir.
                    TotalDurationMs = g.Sum(x => (long)x.ExecutionDuration),
                    MaxDurationMs   = g.Max(x => x.ExecutionDuration),
                    // Count(predicate) EF'de çevrilmiyor; SUM(CASE WHEN) kullanılır.
                    ErrorCount = g.Sum(x => (x.Exceptions != null && x.Exceptions != "")
                                            || (x.HttpStatusCode != null && x.HttpStatusCode >= 500) ? 1 : 0),
                    SlowCallCount = g.Sum(x => x.ExecutionDuration >= SlowThresholdMs ? 1 : 0)
                })
                // Yola göre KARARLI sıra — çağrı sayısına göre sıralayıp kesmek,
                // kimlik taşıyan yolları (her biri 1-2 çağrı) sistematik olarak elerdi
                // ve normalize edilmiş uç eksik sayılırdı.
                .OrderBy(r => r.Url).ThenBy(r => r.HttpMethod)
                .Take(TelemetryConsts.MaxEndpointGroupsScanned));

        return rows
            .GroupBy(r => new
            {
                Method = r.HttpMethod ?? string.Empty,
                Url    = EndpointUrlNormalizer.Normalize(r.Url)
            })
            .Select(g =>
            {
                var calls  = g.Sum(x => x.CallCount);
                var errors = g.Sum(x => x.ErrorCount);
                var total  = g.Sum(x => x.TotalDurationMs);

                return new HealthEndpointStatDto
                {
                    HttpMethod = g.Key.Method.Length == 0 ? null : g.Key.Method,
                    Url        = g.Key.Url,
                    CallCount  = calls,
                    // Ağırlıklı ortalama: grup ortalamalarının ortalamasını almak YANLIŞ olurdu.
                    AverageDurationMs = calls > 0 ? Math.Round((double)total / calls, 1) : 0,
                    MaxDurationMs     = g.Max(x => x.MaxDurationMs),
                    ErrorCount        = errors,
                    ErrorRate         = Rate(errors, calls),
                    SlowCallCount     = g.Sum(x => x.SlowCallCount)
                };
            })
            .ToList();
    }

    private async Task<List<HealthTrendPointDto>> BuildErrorTrendAsync(IQueryable<AuditLog> auditQuery, DateTime since)
    {
        var rows = await AsyncExecuter.ToListAsync(
            FailedRequests(auditQuery)
                .GroupBy(a => a.ExecutionTime.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() }));

        var counts = rows.ToDictionary(r => r.Date, r => r.Count);

        var result = new List<HealthTrendPointDto>();
        for (var day = since.Date; day <= Clock.Now.Date; day = day.AddDays(1))
        {
            result.Add(new HealthTrendPointDto
            {
                Date = day,
                ErrorCount = counts.TryGetValue(day, out var count) ? count : 0
            });
        }

        return result;
    }

    /// <summary>
    /// Kiracı sağlığı: audit tarafı (hacim · hata · süre) ile istemci hatası sayıları
    /// birleştirilir. Yalnız hata SAYISI yanıltıcıdır — 10 istekte 3 hata ile
    /// 100.000 istekte 3 hata aynı satır gibi görünüyordu.
    /// </summary>
    private async Task<List<HealthTenantStatDto>> GetTenantStatsAsync(IQueryable<AuditLog> auditQuery, DateTime since)
    {
        // TenantName audit satırında denormalize (boş ya da bayat olabilir); gruplama
        // Id'ye göre yapılır, ad kiracı tablosundan çözülür.
        var auditRows = await AsyncExecuter.ToListAsync(
            auditQuery
                .GroupBy(a => a.TenantId)
                .Select(g => new TenantGroupRow
                {
                    TenantId        = g.Key,
                    RequestCount    = g.Count(),
                    TotalDurationMs = g.Sum(x => (long)x.ExecutionDuration),
                    ErrorCount      = g.Sum(x => (x.Exceptions != null && x.Exceptions != "")
                                                 || (x.HttpStatusCode != null && x.HttpStatusCode >= 500) ? 1 : 0),
                    SlowCallCount   = g.Sum(x => x.ExecutionDuration >= SlowThresholdMs ? 1 : 0)
                }));

        var clientRows = await AsyncExecuter.ToListAsync(
            (await _clientErrorRepository.GetQueryableAsync())
                .Where(e => e.LastSeenAt >= since)
                .GroupBy(e => e.TenantId)
                .Select(g => new ClientErrorTenantRow
                {
                    TenantId        = g.Key,
                    ErrorCount      = g.Count(),
                    UnresolvedCount = g.Sum(x => x.IsResolved ? 0 : 1)
                }));

        var tenantNames = await GetTenantNamesAsync();

        var stats = auditRows
            .Select(r => new HealthTenantStatDto
            {
                TenantId          = r.TenantId,
                TenantName        = ResolveTenantName(r.TenantId, tenantNames),
                RequestCount      = r.RequestCount,
                ErrorCount        = r.ErrorCount,
                ErrorRate         = Rate(r.ErrorCount, r.RequestCount),
                AverageDurationMs = r.RequestCount > 0 ? Math.Round((double)r.TotalDurationMs / r.RequestCount, 1) : 0,
                SlowCallCount     = r.SlowCallCount
            })
            .ToList();

        // Sunucu isteği görünmeyen ama istemci hatası olan kiracı listeden düşmesin.
        var seen = stats.Select(s => TenantKey(s.TenantId)).ToHashSet();
        stats.AddRange(clientRows
            .Where(r => !seen.Contains(TenantKey(r.TenantId)))
            .Select(r => new HealthTenantStatDto
            {
                TenantId   = r.TenantId,
                TenantName = ResolveTenantName(r.TenantId, tenantNames)
            }));

        var clientByTenant = clientRows.ToDictionary(r => TenantKey(r.TenantId));
        foreach (var stat in stats)
        {
            if (clientByTenant.TryGetValue(TenantKey(stat.TenantId), out var client))
            {
                stat.ClientErrorCount = client.ErrorCount;
                stat.UnresolvedClientErrorCount = client.UnresolvedCount;
            }
        }

        return stats
            .OrderByDescending(s => s.ErrorCount)
            .ThenByDescending(s => s.UnresolvedClientErrorCount)
            .ThenByDescending(s => s.RequestCount)
            .Take(TopTenantsCount)
            .ToList();
    }

    /// <summary>
    /// Normalize uç yoluna göre daraltır. Normalize yol ham audit satırlarıyla EŞİT
    /// DEĞİLDİR (<c>/Projects/ProjectDetails/{id}</c> hiçbir satırla eşleşmez); SQL'de
    /// yalnız sabit önekle ön-daraltma yapılır, tam eşleştirmeyi çağıran bellekte
    /// tamamlar.
    /// </summary>
    private static IQueryable<AuditLog> ApplyEndpointFilter(
        IQueryable<AuditLog> query, string normalizedUrl, string? httpMethod)
    {
        if (!httpMethod.IsNullOrWhiteSpace())
        {
            query = query.Where(a => a.HttpMethod == httpMethod);
        }

        var prefix = EndpointUrlNormalizer.LiteralPrefix(normalizedUrl);
        return prefix.Length == 0
            ? query
            : query.Where(a => a.Url != null && a.Url.StartsWith(prefix));
    }

    /// <summary>Host'un Id'si yoktur; sözlük anahtarı olarak Guid.Empty'ye eşlenir.</summary>
    private static Guid TenantKey(Guid? tenantId) => tenantId ?? Guid.Empty;

    private static double Rate(int part, int total)
        => total > 0 ? Math.Round((double)part / total, 4) : 0;

    private static string? ResolveTenantName(Guid? tenantId, Dictionary<Guid, string> names)
        => tenantId is null
            ? "Host"
            : (names.TryGetValue(tenantId.Value, out var name) ? name : null);

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }

    /// <summary>Uç gruplamasının SQL projeksiyon hedefi (normalizasyon öncesi ham yol).</summary>
    private sealed class EndpointGroupRow
    {
        public string? HttpMethod { get; set; }
        public string Url { get; set; } = string.Empty;
        public int CallCount { get; set; }
        public long TotalDurationMs { get; set; }
        public int MaxDurationMs { get; set; }
        public int ErrorCount { get; set; }
        public int SlowCallCount { get; set; }
    }

    private sealed class TenantGroupRow
    {
        public Guid? TenantId { get; set; }
        public int RequestCount { get; set; }
        public long TotalDurationMs { get; set; }
        public int ErrorCount { get; set; }
        public int SlowCallCount { get; set; }
    }

    private sealed class ClientErrorTenantRow
    {
        public Guid? TenantId { get; set; }
        public int ErrorCount { get; set; }
        public int UnresolvedCount { get; set; }
    }
}
