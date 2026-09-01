using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 1a · Kaynak &amp; Kazıma Konsolu.
///
/// <para>🔴 <b>Kazıma yalnız TASLAK üretir.</b> Bu servis hiçbir çağrıyı yayına almaz;
/// yayın 1b'deki parametre formunun işidir. Yayınlanmayan çağrı kiracıda ve kamu
/// sayfasında görünmez.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantSourceAppService : ApplicationService, IGrantSourceAppService
{
    private readonly IRepository<GrantSource, Guid> _sourceRepo;
    private readonly IRepository<GrantScrapeRun, Guid> _runRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantDraftField, Guid> _draftFieldRepo;
    private readonly IGrantScraper _scraper;

    public GrantSourceAppService(
        IRepository<GrantSource, Guid> sourceRepo,
        IRepository<GrantScrapeRun, Guid> runRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantDraftField, Guid> draftFieldRepo,
        IGrantScraper scraper)
    {
        _sourceRepo = sourceRepo;
        _runRepo = runRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _draftFieldRepo = draftFieldRepo;
        _scraper = scraper;
    }

    public async Task<GrantSourceConsoleDto> GetConsoleAsync()
    {
        EnsureHostContext();

        var sources = (await _sourceRepo.GetListAsync()).OrderBy(s => s.Name).ToList();
        var calls = await _callRepo.GetListAsync();
        var drafts = calls.Where(c => c.Status == GrantCallStatus.Taslak).ToList();

        var grantIds = drafts.Select(d => d.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id))).ToDictionary(g => g.Id);

        var draftIds = drafts.Select(d => d.Id).ToList();
        var fieldsByCall = (await _draftFieldRepo.GetListAsync(f => draftIds.Contains(f.GrantCallId)))
            .GroupBy(f => f.GrantCallId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var lastRunBySource = (await _runRepo.GetListAsync())
            .GroupBy(r => r.SourceId)
            .ToDictionary(g => g.Key, g => g.OrderByDescending(r => r.StartedAt).First());

        var weekAgo = Clock.Now.AddDays(-7);

        return new GrantSourceConsoleDto
        {
            ActiveSourceCount = sources.Count(s => s.IsActive),
            DraftQueueCount = drafts.Count,
            PublishedCallCount = calls.Count(c => c.Status == GrantCallStatus.Acik),
            ChangedThisWeekCount = calls.Count(c => (c.LastModificationTime ?? c.CreationTime) >= weekAgo),
            Sources = sources.Select(s => new GrantSourceDto
            {
                Id = s.Id,
                Name = s.Name,
                Url = s.Url,
                IsActive = s.IsActive,
                LastScrapedAt = s.LastScrapedAt,
                Initial = s.Initial,
                CallCount = calls.Count(c => c.SourceId == s.Id),
                LastRunStatus = lastRunBySource.TryGetValue(s.Id, out var run) ? run.Status : null,
                LastRunNewCount = lastRunBySource.TryGetValue(s.Id, out var r2) ? r2.NewCount : 0
            }).ToList(),
            Drafts = drafts
                .Select(d => new GrantDraftQueueItemDto
                {
                    GrantCallId = d.Id,
                    GrantId = d.GrantId,
                    Title = grants.TryGetValue(d.GrantId, out var g) ? g.Name : string.Empty,
                    Issuer = grants.TryGetValue(d.GrantId, out var g2) ? g2.Issuer : string.Empty,
                    Period = d.Period,
                    Deadline = d.Deadline,
                    MaxAmount = grants.TryGetValue(d.GrantId, out var g3) ? g3.MaxAmount : null,
                    Origin = d.Origin,
                    FieldConfidence = AverageConfidence(fieldsByCall.GetValueOrDefault(d.Id))
                })
                .OrderBy(d => d.FieldConfidence)
                .ThenBy(d => d.Deadline ?? DateTime.MaxValue)
                .ToList()
        };
    }

    /// <summary>
    /// Alan kaydı olmayan çağrı (kazıma öncesi elle girilmiş) 100 sayılır: onaylanacak
    /// bir öneri yoktur, kuyruğun başında "düşük güven" gibi görünmemeli.
    /// </summary>
    private static int AverageConfidence(List<GrantDraftField>? fields)
        => fields == null || fields.Count == 0
            ? 100
            : (int)Math.Round(fields.Average(f => (double)f.Confidence));

    public async Task<GrantSourceDto> CreateAsync(CreateUpdateGrantSourceDto input)
    {
        EnsureHostContext();

        var source = new GrantSource(GuidGenerator.Create(), input.Name)
        {
            Url = input.Url,
            IsActive = input.IsActive
        };
        await _sourceRepo.InsertAsync(source, autoSave: true);
        return Map(source);
    }

    public async Task<GrantSourceDto> UpdateAsync(Guid id, CreateUpdateGrantSourceDto input)
    {
        EnsureHostContext();

        var source = await _sourceRepo.GetAsync(id);
        source.SetName(input.Name);
        source.Url = input.Url;
        source.IsActive = input.IsActive;
        await _sourceRepo.UpdateAsync(source, autoSave: true);
        return Map(source);
    }

    public async Task DeleteAsync(Guid id)
    {
        EnsureHostContext();
        // Çağrılar kalır; FK SetNull olduğu için yalnız kaynak bağı kopar.
        await _sourceRepo.DeleteAsync(id);
    }

    public async Task<GrantScrapeResultDto> ScrapeAllAsync()
    {
        EnsureHostContext();

        var sources = await _sourceRepo.GetListAsync(s => s.IsActive);
        var result = new GrantScrapeResultDto { SourceCount = sources.Count };

        foreach (var source in sources)
        {
            var startedAt = Clock.Now;
            var outcome = string.IsNullOrWhiteSpace(source.Url)
                // Adresi olmayan kaynak taranamaz; koşu yine de kaydedilir ki
                // konsolda "düzelt" yerine "atlandı" görünsün.
                ? GrantScrapeOutcome.Skipped()
                : await _scraper.ScrapeAsync(source);

            var run = new GrantScrapeRun(GuidGenerator.Create(), source.Id, startedAt)
            {
                FinishedAt = Clock.Now,
                Status = outcome.Status,
                FoundCount = outcome.FoundCount,
                NewCount = outcome.NewCount,
                Message = outcome.Message
            };
            await _runRepo.InsertAsync(run, autoSave: true);

            switch (outcome.Status)
            {
                case GrantScrapeRunStatus.Basarili:
                    result.SucceededCount++;
                    result.NewDraftCount += outcome.NewCount;
                    source.LastScrapedAt = run.FinishedAt;
                    await _sourceRepo.UpdateAsync(source, autoSave: true);
                    break;
                case GrantScrapeRunStatus.Hatali:
                    result.FailedCount++;
                    break;
                default:
                    result.SkippedCount++;
                    break;
            }
        }

        return result;
    }

    private static GrantSourceDto Map(GrantSource s) => new()
    {
        Id = s.Id,
        Name = s.Name,
        Url = s.Url,
        IsActive = s.IsActive,
        LastScrapedAt = s.LastScrapedAt,
        Initial = s.Initial
    };

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Hibe kaynakları yalnızca host bağlamında yönetilebilir.");
        }
    }
}
