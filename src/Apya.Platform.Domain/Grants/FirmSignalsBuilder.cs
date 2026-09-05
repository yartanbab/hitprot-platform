using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Projects;

namespace Apya.Platform.Grants;

/// <summary>
/// Belirli bir tenant için <see cref="FirmSignals"/> toplar (profil + proje geçmişi).
/// Hem tenant kendi önerisini hesaplarken (GrantRecommendationAppService, kendi CurrentTenant.Id'si)
/// hem host toplu hedeflemede (GrantHostDispatchAppService, sırayla her tenantId için) kullanılır —
/// <see cref="ICurrentTenant.Change"/> ile bağlam geçici değiştirilir (idiom: TenantUserLimitHandler).
/// </summary>
public class FirmSignalsBuilder : DomainService
{
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly IRepository<FirmProfileTag, Guid> _profileTagRepo;
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IRepository<ProjectCategoryDefinition, Guid> _categoryRepo;
    private readonly IDataFilter _dataFilter;
    private readonly ICurrentTenant _currentTenant;

    public FirmSignalsBuilder(
        IRepository<FirmProfile, Guid> profileRepo,
        IRepository<FirmProfileTag, Guid> profileTagRepo,
        IRepository<Project, Guid> projectRepo,
        IRepository<ProjectCategoryDefinition, Guid> categoryRepo,
        IDataFilter dataFilter,
        ICurrentTenant currentTenant)
    {
        _profileRepo = profileRepo;
        _profileTagRepo = profileTagRepo;
        _projectRepo = projectRepo;
        _categoryRepo = categoryRepo;
        _dataFilter = dataFilter;
        _currentTenant = currentTenant;
    }

    public async Task<FirmSignals> BuildAsync(Guid? tenantId)
    {
        var signals = new FirmSignals();
        using (_currentTenant.Change(tenantId))
        {
            var profile = await _profileRepo.FirstOrDefaultAsync();
            if (profile != null)
            {
                signals.Size = profile.Size;
                signals.FoundedOn = profile.FoundedOn;
                signals.StaffCount = profile.EffectiveStaffCount;
                signals.RdStaffCount = profile.RdStaffCount;
                signals.AnnualRevenue = profile.AnnualRevenue;
                signals.Trl = profile.Trl;
                signals.HasConsortiumPartner = profile.HasConsortiumPartner;
                var ptags = await _profileTagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
                signals.Tags = ptags.Select(t => new FirmSignalTag(t.Kind, t.Value)).ToList();
            }

            var projects = await _projectRepo.GetListAsync();
            var budgeted = projects.Where(p => p.TotalBudget > 0).ToList();
            signals.TypicalProjectBudget = budgeted.Count == 0 ? null : budgeted.Average(p => p.TotalBudget);
            // Davranış ekseni kategori TANIMINDAKİ SystemKey'dir; kullanıcının kendi
            // eklediği kategorilerde null olur ve baskın kategori hesabına girmez.
            // Sistem kayıtları global (TenantId null) — kiracı bağlamında ABP'nin
            // filtresi onları eler, bu yüzden filtre kapatılarak okunur.
            Dictionary<Guid, ProjectCategory> systemKeys;
            using (_dataFilter.Disable<IMultiTenant>())
            {
                systemKeys = (await _categoryRepo.GetListAsync(c => c.SystemKey != null))
                    .ToDictionary(c => c.Id, c => c.SystemKey!.Value);
            }
            var keyed = projects.Where(p => systemKeys.ContainsKey(p.CategoryId)).ToList();
            signals.DominantCategory = keyed.Count == 0
                ? null
                : keyed.GroupBy(p => systemKeys[p.CategoryId])
                    .OrderByDescending(g => g.Count())
                    .ThenBy(g => g.Key)
                    .First().Key;
            signals.ActiveProjectCount = projects.Count(p => p.EndDate == null || p.EndDate.Value.Date >= DateTime.Now.Date);
        }
        return signals;
    }
}
