using System;
using System.Linq;
using System.Threading.Tasks;
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
    private readonly ICurrentTenant _currentTenant;

    public FirmSignalsBuilder(
        IRepository<FirmProfile, Guid> profileRepo,
        IRepository<FirmProfileTag, Guid> profileTagRepo,
        IRepository<Project, Guid> projectRepo,
        ICurrentTenant currentTenant)
    {
        _profileRepo = profileRepo;
        _profileTagRepo = profileTagRepo;
        _projectRepo = projectRepo;
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
                var ptags = await _profileTagRepo.GetListAsync(t => t.FirmProfileId == profile.Id);
                signals.Tags = ptags.Select(t => new FirmSignalTag(t.Kind, t.Value)).ToList();
            }

            var projects = await _projectRepo.GetListAsync();
            var budgeted = projects.Where(p => p.TotalBudget > 0).ToList();
            signals.TypicalProjectBudget = budgeted.Count == 0 ? null : budgeted.Average(p => p.TotalBudget);
            signals.DominantCategory = projects.Count == 0
                ? null
                : projects.GroupBy(p => p.Category)
                    .OrderByDescending(g => g.Count())
                    .ThenBy(g => g.Key)
                    .First().Key;
            signals.ActiveProjectCount = projects.Count(p => p.EndDate == null || p.EndDate.Value.Date >= DateTime.Now.Date);
        }
        return signals;
    }
}
