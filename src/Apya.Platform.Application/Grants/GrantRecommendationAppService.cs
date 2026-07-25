using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Mevcut tenant için profil-uyumlu açık çağrılar — CANLI hesaplanır (kalıcı değil).
/// Katalog (Grant/GrantCall/GrantCriteriaTag) host'ta TenantId=null; okumak için
/// IMultiTenant filtresi geçici kapatılır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantRecommendationAppService : ApplicationService, IGrantRecommendationAppService
{
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<FirmProfileTag, Guid> _profileTagRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantRecommendation, Guid> _hostRecRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantRecommendationAppService(
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantRecommendation, Guid> hostRecRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _appRepo = appRepo;
        _hostRecRepo = hostRecRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _mtFilter = mtFilter;
    }

    public async Task<List<GrantRecommendationDto>> GetMyRecommendationsAsync()
    {
        // 1) Firma sinyalleri (profil + proje geçmişi).
        var signals = await _signalsBuilder.BuildAsync(CurrentTenant.Id);

        // 2) Başvurduğum çağrılar (tenant-scoped).
        var appliedIds = (await _appRepo.GetListAsync()).Select(a => a.GrantCallId).ToHashSet();

        // 2b) Host'un gönderdiği aktif öneriler (B3, tenant-scoped, Dismissed hariç).
        var hostRecCallIds = (await _hostRecRepo.GetListAsync(
                r => r.Source == GrantRecommendationSource.Host && r.Status != GrantRecommendationStatus.Dismissed))
            .Select(r => r.GrantCallId)
            .ToHashSet();

        // 3) Katalog (host TenantId=null → filtreyi kapat).
        var result = new List<GrantRecommendationDto>();
        using (_mtFilter.Disable())
        {
            var openCalls = await _callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik);
            if (openCalls.Count == 0)
            {
                return result;
            }

            var grantIds = openCalls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id))).ToDictionary(g => g.Id);
            var tagsByGrant = (await _criteriaRepo.GetListAsync(t => grantIds.Contains(t.GrantId)))
                .GroupBy(t => t.GrantId)
                .ToDictionary(g => g.Key, g => (IReadOnlyList<GrantCriteriaTag>)g.ToList());

            var today = DateTime.Now.Date;
            foreach (var call in openCalls)
            {
                if (!grants.TryGetValue(call.GrantId, out var grant))
                {
                    continue;
                }
                var gtags = tagsByGrant.TryGetValue(call.GrantId, out var lst)
                    ? lst : (IReadOnlyList<GrantCriteriaTag>)new List<GrantCriteriaTag>();

                var score = _matcher.Score(signals, grant, gtags);
                var isHostRecommended = hostRecCallIds.Contains(call.Id);
                if (score < grant.MinMatchScore && !isHostRecommended)
                {
                    continue;
                }

                result.Add(new GrantRecommendationDto
                {
                    GrantCallId = call.Id,
                    GrantId = grant.Id,
                    GrantName = grant.Name,
                    Issuer = grant.Issuer,
                    Period = call.Period,
                    Deadline = call.Deadline,
                    DaysRemaining = call.Deadline.HasValue ? (int)(call.Deadline.Value.Date - today).TotalDays : (int?)null,
                    MaxAmount = grant.MaxAmount,
                    Score = score,
                    AlreadyApplied = appliedIds.Contains(call.Id),
                    IsHostRecommended = isHostRecommended
                });
            }
        }

        return result
            .OrderByDescending(r => r.Score)
            .ThenBy(r => r.DaysRemaining ?? int.MaxValue)
            .ToList();
    }
}
