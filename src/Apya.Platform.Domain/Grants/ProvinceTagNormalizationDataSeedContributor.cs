using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Bölge etiketleri il sözlüğüne (<see cref="TurkeyProvinces"/>) geçmeden önce serbest metindi.
/// Tanınan yazımları ("istanbul", "ANKARA") resmi ada çevirir; tanınmayanlara dokunmaz —
/// onları kurum ya da host formda görür ve düzeltir. Yalnız farklı yazılmış kayda
/// dokunduğu için her DbMigrator turunda güvenle koşar.
/// </summary>
public class ProvinceTagNormalizationDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<FirmProfileTag, Guid> _profileTagRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaTagRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly ILogger<ProvinceTagNormalizationDataSeedContributor> _logger;

    public ProvinceTagNormalizationDataSeedContributor(
        IRepository<FirmProfileTag, Guid> profileTagRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaTagRepo,
        IDataFilter<IMultiTenant> mtFilter,
        ICurrentTenant currentTenant,
        ILogger<ProvinceTagNormalizationDataSeedContributor> logger)
    {
        _profileTagRepo = profileTagRepo;
        _criteriaTagRepo = criteriaTagRepo;
        _mtFilter = mtFilter;
        _currentTenant = currentTenant;
        _logger = logger;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return; // tek turda tüm kiracılar taranır
        }

        List<FirmProfileTag> profileTags;
        List<GrantCriteriaTag> criteriaTags;
        // Etiketler kiracılara dağınık: OKUMA için filtre bilinçli kapatılır.
        using (_mtFilter.Disable())
        {
            profileTags = await _profileTagRepo.GetListAsync(t => t.Kind == GrantCriteriaKind.Bolge);
            criteriaTags = await _criteriaTagRepo.GetListAsync(t => t.Kind == GrantCriteriaKind.Bolge);
        }

        var changedProfiles = profileTags.Where(t => t.NormalizeProvince()).ToList();
        var changedCriteria = criteriaTags.Where(t => t.NormalizeProvince()).ToList();

        // YAZMA her kaydın kendi kiracı bağlamında (ABP denetim alanları doğru dolsun).
        foreach (var group in changedProfiles.GroupBy(t => t.TenantId))
        {
            using (_currentTenant.Change(group.Key))
            {
                await _profileTagRepo.UpdateManyAsync(group, autoSave: true);
            }
        }
        foreach (var group in changedCriteria.GroupBy(t => t.TenantId))
        {
            using (_currentTenant.Change(group.Key))
            {
                await _criteriaTagRepo.UpdateManyAsync(group, autoSave: true);
            }
        }

        var unknown = profileTags.Count(t => TurkeyProvinces.Find(t.Value) == null)
                      + criteriaTags.Count(t => TurkeyProvinces.Find(t.Value) == null);

        if (changedProfiles.Count + changedCriteria.Count + unknown > 0)
        {
            _logger.LogWarning(
                "Bölge etiketleri il sözlüğüne çevrildi: {Profiles} profil, {Criteria} program etiketi. " +
                "İl adı olmayan {Unknown} etiket olduğu gibi bırakıldı (eşleştirmede şart sayılmaz).",
                changedProfiles.Count, changedCriteria.Count, unknown);
        }
    }
}
