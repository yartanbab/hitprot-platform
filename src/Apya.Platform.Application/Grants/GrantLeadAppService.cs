using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Grants;

/// <summary>
/// 5a · Host: Ön Değerlendirme Talepleri.
///
/// <para>🔴 HOST-ONLY. Talepler kiracıya ait değil; henüz kiracı yok.</para>
///
/// <para>Sıralama ISI skoruna göre: puan "iyi müşteri" değil "bu işi tek başına
/// yapamaz" demektir. Kolay çağrıya uygun firma bilinçle aşağıda kalır.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantLeadAppService : PlatformAppService, IGrantLeadAppService
{
    /// <summary>KPI penceresi (gün).</summary>
    public const int WeekDays = 7;

    /// <summary>Oran bu örneklemin altındaysa GÖSTERİLMEZ (6b ile aynı ilke).</summary>
    public const int MinimumRateSample = 5;

    private readonly IRepository<GrantLead, Guid> _leadRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantLeadAppService(
        IRepository<GrantLead, Guid> leadRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<FirmProfile, Guid> profileRepo,
        IIdentityUserRepository userRepo,
        ITenantManager tenantManager,
        ITenantRepository tenantRepo,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _leadRepo = leadRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _appRepo = appRepo;
        _profileRepo = profileRepo;
        _userRepo = userRepo;
        _tenantManager = tenantManager;
        _tenantRepo = tenantRepo;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
    }

    public async Task<GrantLeadConsoleDto> GetAsync()
    {
        EnsureHostContext();

        var leads = await _leadRepo.GetListAsync();
        var names = await GetGrantNamesAsync(leads);
        var since = Clock.Now.AddDays(-WeekDays);

        var qualified = leads.Count(l => l.HeatScore >= GrantLeadHeatCalculator.QualifiedThreshold);
        var meetings = leads.Count(l => l.PreferredMeetingAt.HasValue);

        return new GrantLeadConsoleDto
        {
            Items = leads
                .OrderByDescending(l => l.HeatScore)
                .ThenByDescending(l => l.CreationTime)
                .Select(l => MapRow(l, names))
                .ToList(),
            ThisWeekCount = leads.Count(l => l.CreationTime >= since),
            QualifiedCount = qualified,
            MeetingCount = meetings,
            // 🔴 Oran örneklem küçükken GÖSTERİLMEZ: üç talepten çıkan "%64"
            // güven veriyormuş gibi durup yanlış yönlendirir (6b ile aynı ilke).
            MeetingRatePercent = qualified >= MinimumRateSample
                ? (int)Math.Round(meetings * 100.0 / qualified)
                : null,
            ConvertedCount = leads.Count(l => l.ConvertedTenantId.HasValue),
            PipelineAmount = leads
                .Where(l => l.Status is not (GrantLeadStatus.Kapandi or GrantLeadStatus.MusteriOldu))
                .Sum(l => l.EstimatedSupport ?? 0m),
            QualifiedThreshold = GrantLeadHeatCalculator.QualifiedThreshold,
            CallThreshold = GrantLeadHeatCalculator.CallThreshold
        };
    }

    public async Task<GrantLeadDetailDto> GetDetailAsync(Guid leadId)
    {
        EnsureHostContext();

        var lead = await GetLeadAsync(leadId);
        var names = await GetGrantNamesAsync(new List<GrantLead> { lead });

        var dto = new GrantLeadDetailDto
        {
            Email = lead.Email,
            Phone = lead.Phone,
            Note = lead.Note,
            Size = lead.Size,
            CompanyAgeYears = lead.CompanyAgeYears,
            Sector = lead.Sector,
            RdStaffCount = lead.RdStaffCount,
            Trl = lead.Trl,
            AnnualRevenue = lead.AnnualRevenue,
            HasConsortiumPartner = lead.HasConsortiumPartner,
            ConvertedTenantId = lead.ConvertedTenantId,
            ConsultantLoads = await BuildConsultantLoadsAsync()
        };

        CopyRow(MapRow(lead, names), dto);
        return dto;
    }

    public async Task<GrantLeadConsoleDto> SetStatusAsync(SetGrantLeadStatusInput input)
    {
        EnsureHostContext();

        var lead = await GetLeadAsync(input.LeadId);
        lead.SetStatus(input.Status, input.Note);
        await _leadRepo.UpdateAsync(lead, autoSave: true);

        return await GetAsync();
    }

    /// <summary>
    /// Talebi müşteriye (kiracıya) dönüştürür ve testten gelen cevapları firma
    /// profiline aktarır — firma profili boş bir ekranla karşılaşmasın.
    /// </summary>
    public async Task<GrantLeadConversionResultDto> ConvertToTenantAsync(ConvertGrantLeadInput input)
    {
        EnsureHostContext();

        var lead = await GetLeadAsync(input.LeadId);
        var name = (input.TenantName ?? lead.FirmName).Trim();

        var tenant = await _tenantManager.CreateAsync(name);
        await _tenantRepo.InsertAsync(tenant, autoSave: true);

        // Profil KİRACININ bağlamında yazılır; host bağlamında yazılsaydı firma
        // kendi profilini göremezdi (2e'deki proje oluşturmayla aynı gerekçe).
        int completion;
        using (_currentTenant.Change(tenant.Id))
        {
            var profile = new FirmProfile(GuidGenerator.Create(), tenant.Id)
            {
                Size = lead.Size,
                FoundedOn = lead.CompanyAgeYears.HasValue
                    ? Clock.Now.Date.AddYears(-lead.CompanyAgeYears.Value)
                    : null,
                RdStaffCount = lead.RdStaffCount,
                AnnualRevenue = lead.AnnualRevenue,
                Trl = lead.Trl,
                HasConsortiumPartner = lead.HasConsortiumPartner
            };
            await _profileRepo.InsertAsync(profile, autoSave: true);
            completion = CompletionPercent(profile);
        }

        lead.MarkConverted(tenant.Id);
        await _leadRepo.UpdateAsync(lead, autoSave: true);

        return new GrantLeadConversionResultDto
        {
            TenantId = tenant.Id,
            TenantName = tenant.Name,
            ProfileCompletionPercent = completion
        };
    }

    // ------------------------------------------------------------------ yardımcılar

    /// <summary>Eşleşmeyi besleyen altı alandan kaçı dolu.</summary>
    private static int CompletionPercent(FirmProfile profile)
    {
        var filled = 0;
        if (profile.Size.HasValue) { filled++; }
        if (profile.FoundedOn.HasValue) { filled++; }
        if (profile.RdStaffCount.HasValue) { filled++; }
        if (profile.AnnualRevenue.HasValue) { filled++; }
        if (profile.Trl.HasValue) { filled++; }
        if (profile.HasConsortiumPartner.HasValue) { filled++; }
        return filled * 100 / 6;
    }

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }

    private async Task<GrantLead> GetLeadAsync(Guid id)
        => await _leadRepo.FindAsync(id)
           ?? throw new BusinessException(PlatformDomainErrorCodes.GrantLeadNotFound);

    private static GrantLeadRowDto MapRow(GrantLead lead, IReadOnlyDictionary<Guid, string> grantNames)
        => new()
        {
            Id = lead.Id,
            FirmName = lead.FirmName,
            ContactName = lead.ContactName,
            ContactTitle = lead.ContactTitle,
            GrantName = grantNames.GetValueOrDefault(lead.GrantCallId, string.Empty),
            CreationTime = lead.CreationTime,
            HeatScore = lead.HeatScore,
            PassedRuleCount = lead.PassedRuleCount,
            TotalRuleCount = lead.TotalRuleCount,
            EstimatedSupport = lead.EstimatedSupport,
            Difficulty = lead.Difficulty,
            Status = lead.Status,
            Signals = ParseSignals(lead.SignalCodes),
            PreferredMeetingAt = lead.PreferredMeetingAt,
            IsConverted = lead.ConvertedTenantId.HasValue
        };

    private static void CopyRow(GrantLeadRowDto from, GrantLeadDetailDto to)
    {
        to.Id = from.Id;
        to.FirmName = from.FirmName;
        to.ContactName = from.ContactName;
        to.ContactTitle = from.ContactTitle;
        to.GrantName = from.GrantName;
        to.CreationTime = from.CreationTime;
        to.HeatScore = from.HeatScore;
        to.PassedRuleCount = from.PassedRuleCount;
        to.TotalRuleCount = from.TotalRuleCount;
        to.EstimatedSupport = from.EstimatedSupport;
        to.Difficulty = from.Difficulty;
        to.Status = from.Status;
        to.Signals = from.Signals;
        to.PreferredMeetingAt = from.PreferredMeetingAt;
        to.IsConverted = from.IsConverted;
    }

    private static List<GrantLeadSignal> ParseSignals(string codes)
        => codes.IsNullOrWhiteSpace()
            ? new List<GrantLeadSignal>()
            : codes.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(c => (GrantLeadSignal)int.Parse(c))
                .ToList();

    private async Task<Dictionary<Guid, string>> GetGrantNamesAsync(List<GrantLead> leads)
    {
        var callIds = leads.Select(l => l.GrantCallId).Distinct().ToList();
        if (callIds.Count == 0) { return new Dictionary<Guid, string>(); }

        using (_mtFilter.Disable())
        {
            var calls = await _callRepo.GetListAsync(c => c.TenantId == null && callIds.Contains(c.Id));
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => g.TenantId == null && grantIds.Contains(g.Id)))
                .ToDictionary(g => g.Id, g => g.Name);

            return calls.ToDictionary(c => c.Id, c => grants.GetValueOrDefault(c.GrantId, string.Empty));
        }
    }

    /// <summary>
    /// Danışman yükü: host kullanıcısına atanmış, henüz kapanmamış başvuru sayısı.
    /// 🔴 Başvurular KİRACIYA ait; filtre kapatılır, <c>TenantId == null</c>
    /// koşulu KONMAZ (konsaydı sayaç daima sıfır çıkardı).
    /// </summary>
    private async Task<List<GrantConsultantLoadDto>> BuildConsultantLoadsAsync()
    {
        List<GrantApplication> applications;
        using (_mtFilter.Disable())
        {
            applications = await _appRepo.GetListAsync(a => a.AssignedUserId != null);
        }

        var counts = applications
            .Where(a => a.Stage != GrantApplicationStage.Odeme)
            .GroupBy(a => a.AssignedUserId!.Value)
            .ToDictionary(g => g.Key, g => g.Count());

        var loads = new List<GrantConsultantLoadDto>();
        foreach (var user in await _userRepo.GetListAsync())
        {
            if (!user.IsActive) { continue; }

            loads.Add(new GrantConsultantLoadDto
            {
                UserId = user.Id,
                Name = $"{user.Name} {user.Surname}".Trim(),
                OpenApplicationCount = counts.GetValueOrDefault(user.Id)
            });
        }

        return loads.OrderBy(l => l.OpenApplicationCount).ThenBy(l => l.Name).ToList();
    }
}
