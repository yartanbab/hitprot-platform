using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Telemetry.Dtos;
using Volo.Abp;
using Volo.Abp.AuditLogging;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Seçili olayın kanıt paneli. <b>Kanal neyi üretebiliyorsa o doldurulur</b>: boş
/// bırakılan bölüm için arayüz sekme çizmez, böylece istemci hatasında "Oluşumlar",
/// sunucu hatasında "Davranış izi" gibi hiç veri olmayan sekmeler tıklatılmaz.
/// </summary>
public partial class SystemHealthAppService
{
    /// <summary>Kanıt panelinde listelenen en fazla tekil istek.</summary>
    private const int DetailOccurrenceCount = 25;

    /// <summary>Olgu şeridinde yol/mesaj gibi uzun değerlerin kırpma sınırı.</summary>
    private const int FactValueLimit = 42;

    public async Task<HealthIssueDetailDto> GetIssueDetailAsync(GetHealthIssueDetailInput input)
    {
        EnsureHostContext();

        var days  = input.WindowDays <= 0 ? 7 : input.WindowDays;
        var now   = Clock.Now;
        var since = now.AddDays(-days);

        using (_multiTenantFilter.Disable())
        {
            return input.Kind <= HealthIssueKind.ClientAjax
                ? await BuildClientDetailAsync(input, since, now)
                : await BuildEndpointDetailAsync(input, since, now, days);
        }
    }

    /* ─── İstemci kanalı ───────────────────────────────────────────────────── */

    private async Task<HealthIssueDetailDto> BuildClientDetailAsync(
        GetHealthIssueDetailInput input, DateTime since, DateTime now)
    {
        if (input.ClientErrorId is null || input.ClientErrorId == Guid.Empty)
        {
            throw new UserFriendlyException("İstemci hatası seçilmedi.");
        }

        var error = await _clientErrorRepository.FindAsync(input.ClientErrorId.Value);
        if (error is null)
        {
            throw new EntityNotFoundException(typeof(ClientError), input.ClientErrorId.Value);
        }

        var tenantNames = await GetTenantNamesAsync();
        var tenantName  = ResolveTenantName(error.TenantId, tenantNames);

        var issue = new HealthIssueDto
        {
            Key             = error.Fingerprint,
            Kind            = (HealthIssueKind)(int)error.Source,
            Title           = error.Message,
            Where           = error.PageUrl,
            TenantId        = error.TenantId,
            TenantName      = tenantName,
            OccurrenceCount = error.OccurrenceCount,
            FirstSeenAt     = error.FirstSeenAt,
            LastSeenAt      = error.LastSeenAt,
            IsResolved      = error.IsResolved,
            ClientErrorId   = error.Id,

            // Ölçülemiyor — ClientError zaman serisi ve kullanıcı sayacı tutmuyor.
            AffectedUserCount = null,
            Trend             = null
        };

        issue.IsRegression = IsRegression(issue.FirstSeenAt, since, now);
        issue.ImpactScore  = CalculateImpact(issue, since, now);

        var detail = new HealthIssueDetailDto
        {
            Issue          = issue,
            ClientErrorId  = error.Id,
            IsResolved     = error.IsResolved,
            StackTrace     = error.StackTrace,
            BreadcrumbJson = error.BreadcrumbJson,
            Facts          = BuildClientFacts(error, tenantName),
            Environment    = BuildClientEnvironment(error, tenantName)
        };

        // Korelasyon yalnız istemci kanalında anlamlı: "tarayıcıda patladı, o an
        // sunucuda ne oldu?" Ters yönde audit satırının karşılığı aranmaz.
        detail.Correlations = await GetCorrelatedServerErrorsAsync(new GetCorrelationInput
        {
            ClientErrorId = error.Id
        });

        return detail;
    }

    private static List<HealthFactDto> BuildClientFacts(ClientError error, string? tenantName)
    {
        // Mockup'ın şeridi "etkilenen kullanıcı · HTTP · süre" istiyor; üçü de tarayıcı
        // tarafında ÖLÇÜLMÜYOR. Boş hücre bırakmak yerine kanalın gerçekten bildiği
        // bilgiler konur — uydurma sayı gösterilmez.
        return new List<HealthFactDto>
        {
            new()
            {
                Label = "Oluşum",
                Value = error.OccurrenceCount.ToString(CultureInfo.InvariantCulture),
                Sub   = "kez görüldü",
                Tone  = error.OccurrenceCount >= 25 ? "negative" : "neutral"
            },
            new()
            {
                Label = "Kaynak",
                Value = SourceLabel(error.Source),
                Sub   = "tarayıcı kanalı"
            },
            new()
            {
                Label = "İlk görülme",
                Value = error.FirstSeenAt.ToString("dd.MM HH:mm", CultureInfo.InvariantCulture),
                Sub   = Ago(error.FirstSeenAt)
            },
            new()
            {
                Label = "Son görülme",
                Value = error.LastSeenAt.ToString("dd.MM HH:mm", CultureInfo.InvariantCulture),
                Sub   = Ago(error.LastSeenAt)
            },
            new()
            {
                Label = "Kiracı",
                Value = tenantName ?? "-",
                Sub   = Shorten(error.PageUrl)
            }
        };
    }

    private static List<HealthFactDto> BuildClientEnvironment(ClientError error, string? tenantName)
    {
        var items = new List<HealthFactDto>();

        void Add(string label, string? value)
        {
            if (!value.IsNullOrWhiteSpace())
            {
                items.Add(new HealthFactDto { Label = label, Value = value! });
            }
        }

        Add("Tarayıcı", error.UserAgent);
        Add("Ekran", error.ScreenResolution);
        Add("Sürüm", error.AppVersion);
        Add("Sayfa", error.PageUrl);
        Add("Kiracı", tenantName);
        Add("İmza", error.Fingerprint);

        return items;
    }

    /* ─── Sunucu ve performans kanalı ──────────────────────────────────────── */

    private async Task<HealthIssueDetailDto> BuildEndpointDetailAsync(
        GetHealthIssueDetailInput input, DateTime since, DateTime now, int windowDays)
    {
        if (input.Url.IsNullOrWhiteSpace())
        {
            throw new UserFriendlyException("Uç seçilmedi.");
        }

        var url = input.Url!;

        var query = (await _auditLogRepository.GetQueryableAsync())
            .Where(a => a.ExecutionTime >= since);

        // İki tür ayrık kalmalı: hata veren uç sunucu hatasıdır, performans ihlali
        // olarak ikinci kez sayılmaz (liste tarafıyla aynı ölçüt).
        query = input.Kind == HealthIssueKind.ServerError
            ? FailedRequests(query)
            : query.Where(a => a.ExecutionDuration >= SlowThresholdMs
                               && (a.Exceptions == null || a.Exceptions == "")
                               && (a.HttpStatusCode == null || a.HttpStatusCode < 500));

        var scanned = await AsyncExecuter.ToListAsync(
            ApplyEndpointFilter(query, url, input.HttpMethod)
                .OrderByDescending(a => a.ExecutionTime)
                .Take(EndpointMatchScanLimit)
                .Select(a => new EndpointDetailRow
                {
                    Url               = a.Url,
                    ExecutionTime     = a.ExecutionTime,
                    ExecutionDuration = a.ExecutionDuration,
                    HttpStatusCode    = a.HttpStatusCode,
                    HttpMethod        = a.HttpMethod,
                    UserId            = a.UserId,
                    UserName          = a.UserName,
                    TenantId          = a.TenantId,
                    TenantName        = a.TenantName,
                    ClientIpAddress   = a.ClientIpAddress,
                    BrowserInfo       = a.BrowserInfo,
                    Exceptions        = a.Exceptions
                }));

        // Ön-daraltma yalnız öneke bakar; tam eşleştirme burada.
        var rows = scanned
            .Where(r => EndpointUrlNormalizer.Normalize(r.Url) == url)
            .ToList();

        if (rows.Count == 0)
        {
            return new HealthIssueDetailDto();
        }

        var tenantNames = await GetTenantNamesAsync();
        var newest      = rows[0];
        var method      = input.HttpMethod.IsNullOrWhiteSpace() ? newest.HttpMethod : input.HttpMethod;
        var label       = $"{method} {url}".Trim();

        var topTenant = rows
            .GroupBy(r => r.TenantId)
            .OrderByDescending(g => g.Count())
            .First().Key;

        var issue = new HealthIssueDto
        {
            Key               = $"{(int)input.Kind}|{method}|{url}",
            Kind              = input.Kind,
            Title             = input.Kind == HealthIssueKind.ServerError ? label : $"Yavaş uç: {label}",
            Where             = url,
            HttpMethod        = method,
            HttpStatusCode    = rows.Max(r => r.HttpStatusCode),
            AverageDurationMs = Math.Round(rows.Average(r => (double)r.ExecutionDuration), 1),
            TenantId          = topTenant,
            TenantName        = ResolveTenantName(topTenant, tenantNames),
            OccurrenceCount   = rows.Count,
            AffectedUserCount = rows.Where(r => r.UserId.HasValue).Select(r => r.UserId!.Value).Distinct().Count(),
            FirstSeenAt       = rows.Min(r => r.ExecutionTime),
            LastSeenAt        = newest.ExecutionTime,
            IsResolved        = false
        };

        issue.IsRegression = IsRegression(issue.FirstSeenAt, since, now);
        issue.ImpactScore  = CalculateImpact(issue, since, now);

        return new HealthIssueDetailDto
        {
            Issue = issue,
            Facts = BuildEndpointFacts(issue),

            // Sunucu kanalında "yığın izi"nin karşılığı exception metnidir; performans
            // ihlalinde exception yoktur, bölüm boş kalır ve sekme hiç çizilmez.
            StackTrace = newest.Exceptions,

            Environment = BuildEndpointEnvironment(newest, ResolveTenantName(newest.TenantId, tenantNames)),
            Occurrences = rows.Take(DetailOccurrenceCount).Select(ToServerErrorDto).ToList(),
            AffectedTenants = BuildAffectedTenants(rows, tenantNames)
        };
    }

    private static List<HealthFactDto> BuildEndpointFacts(HealthIssueDto issue)
    {
        return new List<HealthFactDto>
        {
            new()
            {
                Label = "Oluşum",
                Value = issue.OccurrenceCount.ToString(CultureInfo.InvariantCulture),
                Sub   = issue.Kind == HealthIssueKind.ServerError ? "hatalı istek" : "yavaş çağrı",
                Tone  = issue.Kind == HealthIssueKind.ServerError ? "negative" : "warning"
            },
            new()
            {
                Label = "Etkilenen kullanıcı",
                Value = (issue.AffectedUserCount ?? 0).ToString(CultureInfo.InvariantCulture),
                Sub   = "benzersiz"
            },
            new()
            {
                Label = "İlk görülme",
                Value = issue.FirstSeenAt.ToString("dd.MM HH:mm", CultureInfo.InvariantCulture),
                Sub   = Ago(issue.FirstSeenAt)
            },
            new()
            {
                Label = "HTTP",
                Value = $"{issue.HttpMethod} {issue.HttpStatusCode?.ToString(CultureInfo.InvariantCulture) ?? "-"}".Trim(),
                Sub   = "en kötü durum kodu",
                Tone  = issue.HttpStatusCode >= 500 ? "negative" : "neutral"
            },
            new()
            {
                Label = "Ortalama süre",
                Value = $"{issue.AverageDurationMs?.ToString("0", CultureInfo.InvariantCulture) ?? "-"} ms",
                Sub   = "ağırlıklı",
                Tone  = issue.AverageDurationMs >= SlowThresholdMs ? "warning" : "neutral"
            }
        };
    }

    private static List<HealthFactDto> BuildEndpointEnvironment(EndpointDetailRow row, string? tenantName)
    {
        var items = new List<HealthFactDto>();

        void Add(string label, string? value)
        {
            if (!value.IsNullOrWhiteSpace())
            {
                items.Add(new HealthFactDto { Label = label, Value = value! });
            }
        }

        Add("Son kullanıcı", row.UserName);
        Add("Kiracı", tenantName);
        Add("IP", row.ClientIpAddress);
        Add("Tarayıcı", row.BrowserInfo);
        Add("Adres", row.Url);

        return items;
    }

    /// <summary>
    /// Ucun vurduğu kiracılar — "kim etkileniyor" sekmesi. Bu ucun kayıtları üzerinden
    /// sayılır; kiracının genel sağlığı değildir.
    /// </summary>
    private static List<HealthTenantStatDto> BuildAffectedTenants(
        List<EndpointDetailRow> rows, Dictionary<Guid, string> tenantNames)
    {
        return rows
            .GroupBy(r => r.TenantId)
            .Select(g => new HealthTenantStatDto
            {
                TenantId          = g.Key,
                TenantName        = ResolveTenantName(g.Key, tenantNames),
                RequestCount      = g.Count(),
                ErrorCount        = g.Count(x => x.HttpStatusCode >= 500
                                                 || !x.Exceptions.IsNullOrWhiteSpace()),
                AverageDurationMs = Math.Round(g.Average(x => (double)x.ExecutionDuration), 1)
            })
            .OrderByDescending(t => t.RequestCount)
            .ToList();
    }

    private static ServerErrorDetailDto ToServerErrorDto(EndpointDetailRow row) => new()
    {
        Url               = row.Url,
        ExecutionTime     = row.ExecutionTime,
        ExecutionDuration = row.ExecutionDuration,
        HttpStatusCode    = row.HttpStatusCode,
        HttpMethod        = row.HttpMethod,
        UserName          = row.UserName,
        TenantName        = row.TenantId == null ? "Host" : row.TenantName,
        ClientIpAddress   = row.ClientIpAddress,
        BrowserInfo       = row.BrowserInfo,
        Exceptions        = row.Exceptions
    };

    /* ─── yardımcılar ──────────────────────────────────────────────────────── */

    public static string SourceLabel(ClientErrorSource source) => source switch
    {
        ClientErrorSource.JsError            => "JS Hatası",
        ClientErrorSource.UnhandledRejection => "Promise Reddi",
        ClientErrorSource.AjaxError          => "AJAX Hatası",
        _                                    => source.ToString()
    };

    /// <summary>"5 gün önce" — olgu şeridinin alt satırı.</summary>
    private static string Ago(DateTime moment)
    {
        var span = DateTime.Now - moment;

        if (span.TotalMinutes < 1) return "az önce";
        if (span.TotalHours   < 1) return $"{(int)span.TotalMinutes} dk önce";
        if (span.TotalDays    < 1) return $"{(int)span.TotalHours} saat önce";

        return $"{(int)span.TotalDays} gün önce";
    }

    private static string? Shorten(string? value)
    {
        if (value.IsNullOrWhiteSpace())
        {
            return null;
        }

        return value!.Length <= FactValueLimit ? value : value[..(FactValueLimit - 1)] + "…";
    }

    /// <summary>Kanıt paneli projeksiyonunun hedefi.</summary>
    private sealed class EndpointDetailRow
    {
        public string? Url { get; set; }
        public DateTime ExecutionTime { get; set; }
        public int ExecutionDuration { get; set; }
        public int? HttpStatusCode { get; set; }
        public string? HttpMethod { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
        public Guid? TenantId { get; set; }
        public string? TenantName { get; set; }
        public string? ClientIpAddress { get; set; }
        public string? BrowserInfo { get; set; }
        public string? Exceptions { get; set; }
    }
}
