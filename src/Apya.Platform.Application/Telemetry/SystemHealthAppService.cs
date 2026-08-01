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
public class SystemHealthAppService : ApplicationService, ISystemHealthAppService
{
    private const int TopPagesCount = 10;
    private const int SlowestEndpointsCount = 10;
    private const int TopTenantsCount = 10;

    /// <summary>Tek sorguda taranacak en fazla audit log satırı — büyük tablo tam tarama yapmasın.</summary>
    private const int MaxAuditLogRowsScanned = 200_000;

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

            // Yalnızca özet için gereken alanlar çekilir — EntityChanges/Actions gibi
            // ağır navigation'lar taşınmaz.
            var rows = await AsyncExecuter.ToListAsync(
                auditQuery
                    .OrderByDescending(a => a.ExecutionTime)
                    .Take(MaxAuditLogRowsScanned)
                    .Select(a => new AuditRow
                    {
                        Url = a.Url,
                        ExecutionTime = a.ExecutionTime,
                        ExecutionDuration = a.ExecutionDuration,
                        HttpStatusCode = a.HttpStatusCode,
                        HasException = a.Exceptions != null && a.Exceptions != "",
                        TenantId = a.TenantId,
                        TenantName = a.TenantName
                    }));

            bool IsError(AuditRow r) => r.HasException || (r.HttpStatusCode.HasValue && r.HttpStatusCode.Value >= 500);

            var errorRows = rows.Where(IsError).ToList();
            var totalCount = rows.Count;
            var errorCount = errorRows.Count;

            var unresolvedClientErrors = await CountUnresolvedClientErrorsAsync();
            var clientErrorOccurrences = await SumClientErrorOccurrencesAsync(since);
            var clientErrorsBySource = await GetClientErrorsBySourceAsync(since);
            var tenantOptions = await GetTenantOptionsAsync();

            return new SystemHealthDto
            {
                WindowDays = days,

                UnresolvedClientErrorCount = unresolvedClientErrors,
                ClientErrorOccurrencesInWindow = clientErrorOccurrences,

                ServerRequestCount = totalCount,
                ServerErrorCount = errorCount,
                ServerErrorRate = totalCount > 0 ? Math.Round((double)errorCount / totalCount, 4) : 0,

                TopFailingPages = rows
                    .Where(r => !string.IsNullOrWhiteSpace(r.Url))
                    .GroupBy(r => r.Url!)
                    .Select(g => new HealthPageStatDto
                    {
                        Url = g.Key,
                        TotalCount = g.Count(),
                        ErrorCount = g.Count(IsError),
                        ErrorRate = g.Count() > 0 ? Math.Round((double)g.Count(IsError) / g.Count(), 4) : 0
                    })
                    .Where(p => p.ErrorCount > 0)
                    .OrderByDescending(p => p.ErrorCount)
                    .Take(TopPagesCount)
                    .ToList(),

                SlowestEndpoints = rows
                    .Where(r => !string.IsNullOrWhiteSpace(r.Url))
                    .GroupBy(r => r.Url!)
                    .Select(g => new HealthEndpointStatDto
                    {
                        Url = g.Key,
                        CallCount = g.Count(),
                        AverageDurationMs = Math.Round(g.Average(x => x.ExecutionDuration), 1),
                        MaxDurationMs = g.Max(x => x.ExecutionDuration)
                    })
                    .OrderByDescending(e => e.AverageDurationMs)
                    .Take(SlowestEndpointsCount)
                    .ToList(),

                ErrorTrend = BuildErrorTrend(errorRows, since),

                ErrorsByTenant = errorRows
                    .GroupBy(r => r.TenantId)
                    .Select(g => new HealthTenantStatDto
                    {
                        TenantId = g.Key,
                        TenantName = g.Key == null ? "Host" : g.Select(x => x.TenantName).FirstOrDefault(n => !string.IsNullOrWhiteSpace(n)),
                        ErrorCount = g.Count()
                    })
                    .OrderByDescending(t => t.ErrorCount)
                    .Take(TopTenantsCount)
                    .ToList(),

                ClientErrorsBySource = clientErrorsBySource,
                TenantOptions = tenantOptions
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
            var query = (await _auditLogRepository.GetQueryableAsync())
                .Where(a => a.ExecutionTime >= since && a.Url == input.Url)
                .Where(a => (a.Exceptions != null && a.Exceptions != "")
                            || (a.HttpStatusCode != null && a.HttpStatusCode >= 500));

            return await AsyncExecuter.ToListAsync(
                query.OrderByDescending(a => a.ExecutionTime)
                     .Take(take)
                     .Select(a => new ServerErrorDetailDto
                     {
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

    private static List<HealthTrendPointDto> BuildErrorTrend(List<AuditRow> errorRows, DateTime since)
    {
        var counts = errorRows
            .GroupBy(r => r.ExecutionTime.Date)
            .ToDictionary(g => g.Key, g => g.Count());

        var result = new List<HealthTrendPointDto>();
        for (var day = since.Date; day <= DateTime.Now.Date; day = day.AddDays(1))
        {
            result.Add(new HealthTrendPointDto
            {
                Date = day,
                ErrorCount = counts.TryGetValue(day, out var count) ? count : 0
            });
        }

        return result;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }

    /// <summary>Audit sorgusunun projeksiyon hedefi — ağır navigation'lar taşınmaz.</summary>
    private sealed class AuditRow
    {
        public string? Url { get; set; }
        public DateTime ExecutionTime { get; set; }
        public int ExecutionDuration { get; set; }
        public int? HttpStatusCode { get; set; }
        public bool HasException { get; set; }
        public Guid? TenantId { get; set; }
        public string? TenantName { get; set; }
    }
}
