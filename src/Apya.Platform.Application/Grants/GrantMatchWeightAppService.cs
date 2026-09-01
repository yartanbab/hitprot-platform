using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 4b · Eşleştirme Ağırlıkları. Kapsam iki katmanlı: programın kendi satırı → küresel
/// satır (GrantId null) → <see cref="GrantMatchWeightSet.Default"/>.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantMatchWeightAppService : ApplicationService, IGrantMatchWeightAppService
{
    private static readonly GrantMatchDimension[] Dimensions =
    {
        GrantMatchDimension.Sector,
        GrantMatchDimension.TechnicalMaturity,
        GrantMatchDimension.RdStaff,
        GrantMatchDimension.Region,
        GrantMatchDimension.ProjectHistory,
        GrantMatchDimension.Keyword
    };

    private readonly IRepository<GrantMatchWeight, Guid> _weightRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<FirmProfileTag, Guid> _profileTagRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantMatchWeightAppService(
        IRepository<GrantMatchWeight, Guid> weightRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<FirmProfile, Guid> profileRepo,
        IRepository<FirmProfileTag, Guid> profileTagRepo,
        ITenantRepository tenantRepo,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _weightRepo = weightRepo;
        _grantRepo = grantRepo;
        _callRepo = callRepo;
        _criteriaRepo = criteriaRepo;
        _profileRepo = profileRepo;
        _profileTagRepo = profileTagRepo;
        _tenantRepo = tenantRepo;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _mtFilter = mtFilter;
    }

    public async Task<GrantMatchWeightDto> GetAsync(Guid grantId)
    {
        EnsureHostContext();
        var grant = await _grantRepo.GetAsync(grantId);
        return await MapAsync(grant);
    }

    public async Task<GrantMatchWeightDto> UpdateAsync(Guid grantId, UpdateGrantMatchWeightDto input)
    {
        EnsureHostContext();
        var grant = await _grantRepo.GetAsync(grantId);

        var scope = input.ApplyToAllPrograms ? (Guid?)null : grantId;
        var row = await FindRowAsync(scope);
        if (row == null)
        {
            row = new GrantMatchWeight(GuidGenerator.Create(), scope);
            row.Apply(ToWeightSet(input));
            await _weightRepo.InsertAsync(row, autoSave: true);
        }
        else
        {
            row.Apply(ToWeightSet(input));
            await _weightRepo.UpdateAsync(row, autoSave: true);
        }

        // Küresele yazıldıysa programın kendi satırı ayarı gölgelemeye devam ederdi;
        // "tüm programlar için varsayılan yap" seçildiğinde override kaldırılır.
        if (input.ApplyToAllPrograms)
        {
            var own = await FindRowAsync(grantId);
            if (own != null)
            {
                await _weightRepo.DeleteAsync(own, autoSave: true);
            }
        }

        return await MapAsync(grant);
    }

    public async Task<GrantMatchWeightDto> ResetAsync(Guid grantId)
    {
        EnsureHostContext();
        var grant = await _grantRepo.GetAsync(grantId);

        var own = await FindRowAsync(grantId);
        if (own != null)
        {
            await _weightRepo.DeleteAsync(own, autoSave: true);
        }

        return await MapAsync(grant);
    }

    public async Task<GrantWeightImpactDto> PreviewImpactAsync(Guid grantId, UpdateGrantMatchWeightDto input)
    {
        EnsureHostContext();

        var grant = await _grantRepo.GetAsync(grantId);
        var tags = await _criteriaRepo.GetListAsync(t => t.GrantId == grantId);
        var current = await _weightResolver.ResolveAsync(grantId);
        var candidate = ToWeightSet(input);

        var tenants = await _tenantRepo.GetListAsync();
        var signalsByTenant = await BuildSignalsAsync(tenants.Select(t => t.Id).ToList());

        var movers = new List<GrantWeightMoverDto>();
        var currentMatching = 0;
        var newMatching = 0;
        foreach (var tenant in tenants)
        {
            var signals = signalsByTenant[tenant.Id];
            var before = _matcher.Score(signals, grant, tags, current);
            var after = _matcher.Score(signals, grant, tags, candidate);

            if (before >= grant.MinMatchScore) { currentMatching++; }
            if (after >= grant.MinMatchScore) { newMatching++; }

            if (before != after)
            {
                movers.Add(new GrantWeightMoverDto
                {
                    TenantName = tenant.Name,
                    CurrentScore = before,
                    NewScore = after
                });
            }
        }

        return new GrantWeightImpactDto
        {
            TotalFirms = tenants.Count,
            CurrentMatchingFirms = currentMatching,
            NewMatchingFirms = newMatching,
            TopMovers = movers
                .OrderByDescending(m => m.NewScore - m.CurrentScore)
                .ThenBy(m => m.TenantName)
                .Take(5)
                .ToList()
        };
    }

    public async Task<List<GrantMissingDataRowDto>> GetMissingDataAsync()
    {
        EnsureHostContext();

        var tenantCount = (int)await _tenantRepo.GetCountAsync();

        // 🔴 Filtre BİLEREK tüm kiracılara açılıyor: host, kaç firmada hangi alanın boş
        // olduğunu sayıyor. TenantId == null koşulu KONMAZ — konursa host satırları gelir.
        List<FirmProfile> profiles;
        List<FirmProfileTag> profileTags;
        using (_mtFilter.Disable())
        {
            profiles = await _profileRepo.GetListAsync();
            profileTags = await _profileTagRepo.GetListAsync(t => t.Kind == GrantCriteriaKind.NaceKodu);
        }

        var profilesWithNace = profileTags
            .Select(t => t.FirmProfileId)
            .Distinct()
            .ToHashSet();

        // Profili hiç olmayan kiracı da "eksik" sayılır: tenantCount üzerinden hesaplanır.
        int Missing(Func<FirmProfile, bool> hasValue)
            => tenantCount - profiles.Count(hasValue);

        var affected = await CountAffectedCallsAsync();

        var rows = new List<GrantMissingDataRowDto>
        {
            Row(GrantFirmDataField.Nace, tenantCount - profiles.Count(p => profilesWithNace.Contains(p.Id))),
            Row(GrantFirmDataField.Trl, Missing(p => p.Trl.HasValue)),
            Row(GrantFirmDataField.RdStaff, Missing(p => p.RdStaffCount.HasValue)),
            Row(GrantFirmDataField.StaffCount, Missing(p => p.StaffCount.HasValue)),
            Row(GrantFirmDataField.Revenue, Missing(p => p.AnnualRevenue.HasValue)),
            Row(GrantFirmDataField.FoundedOn, Missing(p => p.FoundedOn.HasValue)),
            Row(GrantFirmDataField.ConsortiumPartner, Missing(p => p.HasConsortiumPartner.HasValue)),
            Row(GrantFirmDataField.CompanySize, Missing(p => p.Size.HasValue))
        };

        return rows
            .Where(r => r.FirmCount > 0)
            .OrderByDescending(r => r.AffectedCallCount)
            .ThenByDescending(r => r.FirmCount)
            .ToList();

        GrantMissingDataRowDto Row(GrantFirmDataField field, int firmCount) => new()
        {
            Field = field,
            FirmCount = firmCount,
            AffectedCallCount = affected.TryGetValue(field, out var n) ? n : 0
        };
    }

    /// <summary>Açık çağrılardan kaçının programı ilgili alana şart koyduğu.</summary>
    private async Task<Dictionary<GrantFirmDataField, int>> CountAffectedCallsAsync()
    {
        var openCalls = await _callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik);
        var grantIds = openCalls.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id))).ToDictionary(g => g.Id);
        var naceGrantIds = (await _criteriaRepo.GetListAsync(
                t => grantIds.Contains(t.GrantId) && t.Kind == GrantCriteriaKind.NaceKodu))
            .Select(t => t.GrantId)
            .ToHashSet();

        var result = new Dictionary<GrantFirmDataField, int>();
        void Bump(GrantFirmDataField field) =>
            result[field] = result.TryGetValue(field, out var n) ? n + 1 : 1;

        foreach (var call in openCalls)
        {
            if (!grants.TryGetValue(call.GrantId, out var g))
            {
                continue;
            }
            if (naceGrantIds.Contains(g.Id)) { Bump(GrantFirmDataField.Nace); }
            if (g.MinTrl.HasValue || g.MaxTrl.HasValue) { Bump(GrantFirmDataField.Trl); }
            if (g.MinRdStaffCount.HasValue) { Bump(GrantFirmDataField.RdStaff); }
            if (g.MinStaffCount.HasValue) { Bump(GrantFirmDataField.StaffCount); }
            if (g.MinRevenue.HasValue || g.MaxRevenue.HasValue) { Bump(GrantFirmDataField.Revenue); }
            if (g.MinCompanyAgeYears.HasValue || g.MaxCompanyAgeYears.HasValue) { Bump(GrantFirmDataField.FoundedOn); }
            if (g.RequiresConsortium) { Bump(GrantFirmDataField.ConsortiumPartner); }
            if (g.EligibleCompanySizes != 0) { Bump(GrantFirmDataField.CompanySize); }
        }

        return result;
    }

    private Task<GrantMatchWeight?> FindRowAsync(Guid? grantId)
        => _weightRepo.FirstOrDefaultAsync(w => w.GrantId == grantId);

    private static GrantMatchWeightSet ToWeightSet(UpdateGrantMatchWeightDto input)
    {
        var set = new GrantMatchWeightSet
        {
            SizePenaltyEnabled = input.SizePenaltyEnabled,
            SkipMissingDimensions = input.SkipMissingDimensions
        };
        foreach (var d in input.Dimensions)
        {
            set[d.Dimension] = d.Multiplier;
        }
        return set;
    }

    private async Task<GrantMatchWeightDto> MapAsync(Grant grant)
    {
        var own = await FindRowAsync(grant.Id);
        var global = own == null ? await FindRowAsync(null) : null;
        var set = own?.ToWeightSet() ?? global?.ToWeightSet() ?? GrantMatchWeightSet.Default;

        return new GrantMatchWeightDto
        {
            GrantId = grant.Id,
            GrantName = grant.Name,
            IsInherited = own == null,
            IsFactoryDefault = own == null && global == null,
            SizePenaltyEnabled = set.SizePenaltyEnabled,
            SkipMissingDimensions = set.SkipMissingDimensions,
            Dimensions = Dimensions
                .Select(d => new GrantDimensionWeightDto { Dimension = d, Multiplier = set[d] })
                .ToList(),
            PublishedCallCount = (int)await _callRepo.CountAsync(c => c.Status == GrantCallStatus.Acik)
        };
    }

    private async Task<Dictionary<Guid, FirmSignals>> BuildSignalsAsync(List<Guid> tenantIds)
    {
        // 🔴 Aynı gerekçe: host tüm kiracıların profillerini okur.
        List<FirmProfile> profiles;
        List<FirmProfileTag> tags;
        using (_mtFilter.Disable())
        {
            profiles = await _profileRepo.GetListAsync();
            tags = await _profileTagRepo.GetListAsync();
        }

        var tagsByProfile = tags.GroupBy(t => t.FirmProfileId)
            .ToDictionary(g => g.Key, g => g.ToList());
        var profileByTenant = profiles
            .Where(p => p.TenantId.HasValue)
            .GroupBy(p => p.TenantId!.Value)
            .ToDictionary(g => g.Key, g => g.First());

        var result = new Dictionary<Guid, FirmSignals>();
        foreach (var tenantId in tenantIds)
        {
            if (!profileByTenant.TryGetValue(tenantId, out var profile))
            {
                result[tenantId] = new FirmSignals();
                continue;
            }
            result[tenantId] = new FirmSignals
            {
                Size = profile.Size,
                FoundedOn = profile.FoundedOn,
                StaffCount = profile.StaffCount,
                RdStaffCount = profile.RdStaffCount,
                AnnualRevenue = profile.AnnualRevenue,
                Trl = profile.Trl,
                HasConsortiumPartner = profile.HasConsortiumPartner,
                Tags = (tagsByProfile.TryGetValue(profile.Id, out var pt) ? pt : new List<FirmProfileTag>())
                    .Select(t => new FirmSignalTag(t.Kind, t.Value))
                    .ToList()
            };
        }
        return result;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Eşleştirme ağırlıkları yalnızca host bağlamında yönetilebilir.");
        }
    }
}
