using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Telemetry.Dtos;
using Volo.Abp;
using Volo.Abp.AuditLogging;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Teşhis konsolunun motoru: üç kanalı (istemci hatası · sunucu hatası · performans
/// ihlali) tek listeye indirger, etkiye göre sıralar ve istemci↔sunucu korelasyonunu
/// kurar.
/// <para>
/// Ölçülemeyen alan UYDURULMAZ: <see cref="ClientError"/> zaman serisi ve dağıtık
/// kullanıcı sayacı tutmadığı için istemci satırlarında <c>Trend</c> ve
/// <c>AffectedUserCount</c> null döner (şema değiştirilmedi — bilinçli karar).
/// </para>
/// </summary>
public partial class SystemHealthAppService
{
    /// <summary>Etki skorundaki yenilik ağırlığının alt/üst sınırı.</summary>
    private const double MinRecencyWeight = 0.5;
    private const double MaxRecencyWeight = 2.0;

    /// <summary>İlk görülme pencerenin son bu oranına düşerse "regresyon" sayılır.</summary>
    private const double RegressionWindowShare = 0.2;

    /// <summary>Regresyonun etki skoruna çarpanı — yeni çıkmış arıza öne gelsin.</summary>
    private const double RegressionBoost = 1.5;

    /// <summary>Sparkline kova sayısı; pencere 7 gün de olsa 90 gün de olsa sabit.</summary>
    private const int TrendBucketCount = 10;

    /// <summary>
    /// Olay sorgularında okunacak en fazla grup. Bu sorgular yalnız SORUNLU istekler
    /// (hata vermiş ya da yavaş) üzerinde çalışır — trafiğin küçük bir azınlığı.
    /// </summary>
    private const int IssueGroupScanLimit = 20_000;

    /// <summary>Etki sıralaması bellekte yapıldığından adaylar fazladan çekilir.</summary>
    private const int CandidateOverFetchFactor = 3;

    public async Task<HealthIssueListDto> GetIssuesAsync(GetHealthIssueListInput input)
    {
        EnsureHostContext();

        var days  = input.WindowDays <= 0 ? 7 : input.WindowDays;
        var now   = Clock.Now;
        var since = now.AddDays(-days);

        using (_multiTenantFilter.Disable())
        {
            var tenantNames = await GetTenantNamesAsync();

            // EVREN: pencere + kiracı + metin süzgeci. Kanal ve durum süzgeci burada
            // UYGULANMAZ — çipler o kapsamda nelerin bulunduğunu göstermeli, yoksa
            // "Sunucu"ya basınca "İstemci · 3" sıfırlanır ve çip kendini gizlerdi.
            var universe = new List<HealthIssueDto>();
            universe.AddRange(await BuildClientIssuesAsync(input, since, tenantNames));

            foreach (var kind in new[] { HealthIssueKind.ServerError, HealthIssueKind.Performance })
            {
                universe.AddRange(await BuildEndpointIssuesAsync(input, since, days, tenantNames, kind));
            }

            if (!input.Filter.IsNullOrWhiteSpace())
            {
                var term = input.Filter!.Trim();
                universe = universe
                    .Where(i => i.Title.Contains(term, StringComparison.OrdinalIgnoreCase)
                                || (i.Where ?? string.Empty).Contains(term, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            foreach (var issue in universe)
            {
                issue.IsRegression = IsRegression(issue.FirstSeenAt, since, now);
                issue.ImpactScore  = CalculateImpact(issue, since, now);
            }

            var result = new HealthIssueListDto
            {
                OpenCount        = universe.Count(i => !i.IsResolved),
                ResolvedCount    = universe.Count(i => i.IsResolved),
                ClientCount      = universe.Count(i => i.Kind <= HealthIssueKind.ClientAjax),
                ServerCount      = universe.Count(i => i.Kind == HealthIssueKind.ServerError),
                PerformanceCount = universe.Count(i => i.Kind == HealthIssueKind.Performance)
            };

            var selected = universe.AsEnumerable();

            if (input.Kinds is { Count: > 0 })
            {
                selected = selected.Where(i => input.Kinds.Contains(i.Kind));
            }

            if (input.IsResolved.HasValue)
            {
                selected = selected.Where(i => i.IsResolved == input.IsResolved.Value);
            }

            var filtered = selected.ToList();
            result.TotalCount = filtered.Count;
            result.Items = SortIssues(filtered, input.Sort)
                .Take(Math.Clamp(input.MaxResultCount, 1, 200))
                .ToList();

            return result;
        }
    }

    public async Task<List<CorrelatedServerErrorDto>> GetCorrelatedServerErrorsAsync(GetCorrelationInput input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var error = await _clientErrorRepository.FindAsync(input.ClientErrorId);
            if (error is null)
            {
                throw new EntityNotFoundException(typeof(ClientError), input.ClientErrorId);
            }

            // ClientError yalnız SON oluşumun anını tutar; korelasyon penceresi de
            // oradan kurulur. Geçmiş oluşumlar için karşılık aranamaz.
            var seconds = Math.Clamp(input.WindowSeconds, 1, 60);
            var from    = error.LastSeenAt.AddSeconds(-seconds);
            var to      = error.LastSeenAt.AddSeconds(seconds);

            var rows = await AsyncExecuter.ToListAsync(
                (await _auditLogRepository.GetQueryableAsync())
                    .Where(a => a.ExecutionTime >= from && a.ExecutionTime <= to)
                    .Where(a => a.TenantId == error.TenantId)
                    .OrderBy(a => a.ExecutionTime)
                    .Take(Math.Clamp(input.MaxResultCount, 1, 50))
                    .Select(a => new CorrelatedServerErrorDto
                    {
                        ExecutionTime     = a.ExecutionTime,
                        Url               = a.Url,
                        HttpMethod        = a.HttpMethod,
                        HttpStatusCode    = a.HttpStatusCode,
                        ExecutionDuration = a.ExecutionDuration,
                        UserName          = a.UserName,
                        Exceptions        = a.Exceptions
                    }));

            foreach (var row in rows)
            {
                row.OffsetSeconds = Math.Round((row.ExecutionTime - error.LastSeenAt).TotalSeconds, 2);
            }

            return rows;
        }
    }

    /* ─── İstemci kanalı ───────────────────────────────────────────────────── */

    private async Task<List<HealthIssueDto>> BuildClientIssuesAsync(
        GetHealthIssueListInput input, DateTime since, Dictionary<Guid, string> tenantNames)
    {
        // Kanal ve durum süzgeci burada UYGULANMAZ: çağıran, çip sayaçlarını
        // süzgeçsiz evren üzerinden hesaplıyor (bkz. GetIssuesAsync).
        var query = (await _clientErrorRepository.GetQueryableAsync())
            .Where(e => e.LastSeenAt >= since);

        if (input.HostOnly)
        {
            query = query.Where(e => e.TenantId == null);
        }
        else if (input.TenantId.HasValue)
        {
            query = query.Where(e => e.TenantId == input.TenantId.Value);
        }

        var rows = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(e => e.OccurrenceCount)
                .Take(input.MaxResultCount * CandidateOverFetchFactor)
                .Select(e => new ClientIssueRow
                {
                    Id              = e.Id,
                    Fingerprint     = e.Fingerprint,
                    Source          = e.Source,
                    Message         = e.Message,
                    PageUrl         = e.PageUrl,
                    TenantId        = e.TenantId,
                    OccurrenceCount = e.OccurrenceCount,
                    FirstSeenAt     = e.FirstSeenAt,
                    LastSeenAt      = e.LastSeenAt,
                    IsResolved      = e.IsResolved
                }));

        return rows
            .Select(r => new HealthIssueDto
            {
                Key             = r.Fingerprint,
                Kind            = (HealthIssueKind)(int)r.Source,
                Title           = r.Message,
                Where           = r.PageUrl,
                TenantId        = r.TenantId,
                TenantName      = ResolveTenantName(r.TenantId, tenantNames),
                OccurrenceCount = r.OccurrenceCount,
                FirstSeenAt     = r.FirstSeenAt,
                LastSeenAt      = r.LastSeenAt,
                IsResolved      = r.IsResolved,
                ClientErrorId   = r.Id,

                // Ölçülemiyor — ClientError tek satırı her oluşumda üzerine yazıyor.
                AffectedUserCount = null,
                Trend             = null
            })
            .ToList();
    }

    /* ─── Sunucu ve performans kanalı ──────────────────────────────────────── */

    /// <summary>
    /// Uç bazlı olayları derler. İki tür AYRIKTIR: hata veren bir uç sunucu hatası
    /// sayılır, ayrıca performans ihlali olarak ikinci kez listelenmez — aksi halde
    /// aynı arıza konsolda iki satır olurdu.
    /// </summary>
    private async Task<List<HealthIssueDto>> BuildEndpointIssuesAsync(
        GetHealthIssueListInput input,
        DateTime since,
        int windowDays,
        Dictionary<Guid, string> tenantNames,
        HealthIssueKind kind)
    {
        var baseQuery = (await _auditLogRepository.GetQueryableAsync())
            .Where(a => a.ExecutionTime >= since)
            .Where(a => a.Url != null && a.Url != "");

        if (input.HostOnly)
        {
            baseQuery = baseQuery.Where(a => a.TenantId == null);
        }
        else if (input.TenantId.HasValue)
        {
            baseQuery = baseQuery.Where(a => a.TenantId == input.TenantId.Value);
        }

        baseQuery = kind == HealthIssueKind.ServerError
            ? baseQuery.Where(a => (a.Exceptions != null && a.Exceptions != "")
                                   || (a.HttpStatusCode != null && a.HttpStatusCode >= 500))
            : baseQuery.Where(a => a.ExecutionDuration >= SlowThresholdMs
                                   && (a.Exceptions == null || a.Exceptions == "")
                                   && (a.HttpStatusCode == null || a.HttpStatusCode < 500));

        // Gün kovaları + ilk/son görülme. Gruplama ham yola göredir; normalizasyon
        // dönen küçük küme üzerinde bellekte yapılır.
        var dayRows = await AsyncExecuter.ToListAsync(
            baseQuery
                .GroupBy(a => new { a.HttpMethod, a.Url, a.ExecutionTime.Date })
                .Select(g => new EndpointDayRow
                {
                    HttpMethod  = g.Key.HttpMethod,
                    Url         = g.Key.Url!,
                    Day         = g.Key.Date,
                    Count       = g.Count(),
                    FirstSeenAt = g.Min(x => x.ExecutionTime),
                    LastSeenAt  = g.Max(x => x.ExecutionTime),
                    // (long): Postgres SUM(int)→bigint döner, SQL Server'da int taşar.
                    TotalDurationMs = g.Sum(x => (long)x.ExecutionDuration),
                    // "En son" durum kodu GroupBy'da ifade edilemiyor; en YÜKSEK kod
                    // alınır — arızalı uçta bu zaten 5xx'tir, en kötü durumu gösterir.
                    MaxStatusCode = g.Max(x => x.HttpStatusCode)
                })
                .OrderBy(r => r.Url).ThenBy(r => r.HttpMethod)
                .Take(IssueGroupScanLimit));

        if (dayRows.Count == 0)
        {
            return new List<HealthIssueDto>();
        }

        // Etkilenen kullanıcı VE kiracı dağılımı tek sorgudan: ikisi de aynı
        // kırılımın (uç × kiracı × kullanıcı) türevi.
        var actorRows = await AsyncExecuter.ToListAsync(
            baseQuery
                .GroupBy(a => new { a.HttpMethod, a.Url, a.TenantId, a.UserId })
                .Select(g => new EndpointActorRow
                {
                    HttpMethod = g.Key.HttpMethod,
                    Url        = g.Key.Url!,
                    TenantId   = g.Key.TenantId,
                    UserId     = g.Key.UserId,
                    Count      = g.Count()
                })
                .OrderBy(r => r.Url).ThenBy(r => r.HttpMethod)
                .Take(IssueGroupScanLimit));

        var actorsByEndpoint = actorRows
            .GroupBy(r => Identify(r.HttpMethod, r.Url))
            .ToDictionary(g => g.Key, g => g.ToList());

        return dayRows
            .GroupBy(r => Identify(r.HttpMethod, r.Url))
            .Select(g => BuildEndpointIssue(
                g.Key, g.ToList(), actorsByEndpoint, tenantNames, kind, since, windowDays))
            .ToList();
    }

    private HealthIssueDto BuildEndpointIssue(
        EndpointIdentity identity,
        List<EndpointDayRow> dayRows,
        Dictionary<EndpointIdentity, List<EndpointActorRow>> actorsByEndpoint,
        Dictionary<Guid, string> tenantNames,
        HealthIssueKind kind,
        DateTime since,
        int windowDays)
    {
        var method     = identity.Method.Length == 0 ? null : identity.Method;
        var label      = $"{method} {identity.Url}".Trim();
        var occurrence = dayRows.Sum(d => d.Count);
        var totalMs    = dayRows.Sum(d => d.TotalDurationMs);

        Guid? topTenant = null;
        string? tenantName = null;
        int? affectedUsers = null;

        if (actorsByEndpoint.TryGetValue(identity, out var actors) && actors.Count > 0)
        {
            // Anonim istekler (UserId null) kullanıcı sayısına girmez ama kiracı
            // dağılımında sayılır — uç yine de o kiracıyı etkiliyor.
            affectedUsers = actors
                .Where(a => a.UserId.HasValue)
                .Select(a => a.UserId!.Value)
                .Distinct()
                .Count();

            topTenant = actors
                .GroupBy(a => a.TenantId)
                .OrderByDescending(g => g.Sum(x => x.Count))
                .Select(g => g.Key)
                .First();

            tenantName = ResolveTenantName(topTenant, tenantNames);
        }

        return new HealthIssueDto
        {
            Key             = $"{(int)kind}|{identity.Method}|{identity.Url}",
            Kind            = kind,
            Title           = kind == HealthIssueKind.ServerError ? label : $"Yavaş uç: {label}",
            Where             = identity.Url,
            HttpMethod        = method,
            HttpStatusCode    = dayRows.Max(d => d.MaxStatusCode),
            AverageDurationMs = occurrence > 0 ? Math.Round((double)totalMs / occurrence, 1) : null,
            TenantId          = topTenant,
            TenantName        = tenantName,
            OccurrenceCount   = occurrence,
            AffectedUserCount = affectedUsers,
            FirstSeenAt       = dayRows.Min(d => d.FirstSeenAt),
            LastSeenAt        = dayRows.Max(d => d.LastSeenAt),
            IsResolved        = false,
            Trend             = BuildTrendBuckets(dayRows, since, windowDays)
        };
    }

    /* ─── Etki / sıralama ──────────────────────────────────────────────────── */

    /// <summary>İlk görülme pencerenin son %20'sine düşüyorsa yeni çıkmış arızadır.</summary>
    private static bool IsRegression(DateTime firstSeenAt, DateTime since, DateTime now)
    {
        var total = (now - since).TotalSeconds;
        if (total <= 0)
        {
            return false;
        }

        return (firstSeenAt - since).TotalSeconds >= total * (1 - RegressionWindowShare);
    }

    /// <summary>
    /// Etki = oluşum × etkilenen kullanıcı × yenilik (regresyonda ek çarpan).
    /// Etkilenen kullanıcı ölçülemiyorsa 1 kabul edilir — sayı UYDURULMAZ, yalnız
    /// çarpan nötrlenir; istemci hataları bu yüzden oluşum × yenilik ile sıralanır.
    /// </summary>
    private static double CalculateImpact(HealthIssueDto issue, DateTime since, DateTime now)
    {
        var total = (now - since).TotalSeconds;
        var position = total <= 0
            ? 1
            : Math.Clamp((issue.LastSeenAt - since).TotalSeconds / total, 0, 1);

        var recency = MinRecencyWeight + (MaxRecencyWeight - MinRecencyWeight) * position;
        var users   = Math.Max(1, issue.AffectedUserCount ?? 1);
        var score   = issue.OccurrenceCount * users * recency;

        if (issue.IsRegression)
        {
            score *= RegressionBoost;
        }

        return Math.Round(score, 1);
    }

    private static IEnumerable<HealthIssueDto> SortIssues(List<HealthIssueDto> issues, HealthIssueSort sort)
        => sort switch
        {
            HealthIssueSort.LastSeen   => issues.OrderByDescending(i => i.LastSeenAt),
            HealthIssueSort.Occurrence => issues.OrderByDescending(i => i.OccurrenceCount),
            _                          => issues.OrderByDescending(i => i.ImpactScore)
        };

    /// <summary>
    /// Gün sayımlarını pencereye yayılmış sabit sayıda kovaya indirger; sparkline
    /// 7 günlük de 90 günlük de pencerede aynı genişlikte çizilir.
    /// </summary>
    private static List<int> BuildTrendBuckets(List<EndpointDayRow> dayRows, DateTime since, int windowDays)
    {
        var buckets = new int[TrendBucketCount];
        var startDay = since.Date;
        var span = Math.Max(1, windowDays);

        foreach (var row in dayRows)
        {
            var offset = (row.Day.Date - startDay).Days;
            var index  = (int)Math.Floor(offset * (double)TrendBucketCount / span);
            buckets[Math.Clamp(index, 0, TrendBucketCount - 1)] += row.Count;
        }

        return buckets.ToList();
    }

    private static EndpointIdentity Identify(string? httpMethod, string rawUrl)
        => new(httpMethod ?? string.Empty, EndpointUrlNormalizer.Normalize(rawUrl));

    /* ─── Projeksiyon hedefleri ────────────────────────────────────────────── */

    /// <summary>Normalize edilmiş uç kimliği: metot + yol.</summary>
    private readonly record struct EndpointIdentity(string Method, string Url);

    private sealed class ClientIssueRow
    {
        public Guid Id { get; set; }
        public string Fingerprint { get; set; } = string.Empty;
        public ClientErrorSource Source { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? PageUrl { get; set; }
        public Guid? TenantId { get; set; }
        public int OccurrenceCount { get; set; }
        public DateTime FirstSeenAt { get; set; }
        public DateTime LastSeenAt { get; set; }
        public bool IsResolved { get; set; }
    }

    private sealed class EndpointDayRow
    {
        public string? HttpMethod { get; set; }
        public string Url { get; set; } = string.Empty;
        public DateTime Day { get; set; }
        public int Count { get; set; }
        public DateTime FirstSeenAt { get; set; }
        public DateTime LastSeenAt { get; set; }
        public long TotalDurationMs { get; set; }
        public int? MaxStatusCode { get; set; }
    }

    private sealed class EndpointActorRow
    {
        public string? HttpMethod { get; set; }
        public string Url { get; set; } = string.Empty;
        public Guid? TenantId { get; set; }
        public Guid? UserId { get; set; }
        public int Count { get; set; }
    }
}
