using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2b · Başvurunun evrak kontrol listesini çağrının şablonundan türetir.
///
/// <para>İki ekran çağırır: evrak takibi (2b) ve danışman detayı (2d). Yalnız
/// evrak takibi çağırsaydı detaydaki Form durumu kartı, o ekran bir kez açılana
/// kadar şablonda zorunlu evrak olsa bile "boş" gösterirdi.</para>
/// </summary>
public class GrantDocumentChecklistManager : DomainService
{
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantDocumentRequirement, Guid> _requirementRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantDocumentChecklistManager(
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantDocumentRequirement, Guid> requirementRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _docRepo = docRepo;
        _requirementRepo = requirementRepo;
        _mtFilter = mtFilter;
    }

    /// <summary>
    /// Kontrol listesini çağrının şablonuyla eşitler. Şablonda olup listede olmayan
    /// satır eklenir; listede olup şablondan çıkarılmış satır SİLİNMEZ — yüklenmiş
    /// evrakı ve sürüm geçmişini yok etmek denetim izini koparırdı.
    ///
    /// <para>🔴 Danışman HOST bağlamında çalışır, evrak satırları ise KİRACIYA aittir;
    /// filtre açık okunursa liste boş gelir ve şablon her açılışta yeniden eklenir.</para>
    /// </summary>
    public async Task EnsureAsync(GrantApplication application, Guid grantId)
    {
        List<GrantDocumentRequirement> requirements;
        List<GrantApplicationDocument> existing;
        using (_mtFilter.Disable())
        {
            requirements = (await _requirementRepo.GetListAsync(r => r.GrantId == grantId && r.TenantId == null))
                .OrderBy(r => r.Order).ToList();
            if (requirements.Count == 0) { return; }

            existing = await _docRepo.GetListAsync(d => d.GrantApplicationId == application.Id);
        }

        var known = existing.Where(d => d.RequirementId.HasValue)
            .Select(d => d.RequirementId!.Value).ToHashSet();

        foreach (var requirement in requirements.Where(r => !known.Contains(r.Id)))
        {
            await _docRepo.InsertAsync(new GrantApplicationDocument(
                GuidGenerator.Create(), application.TenantId, application.Id,
                requirement.Id, requirement.Name, requirement.Obligation,
                requirement.UploaderParty, requirement.RequiresESignature,
                requirement.Order), autoSave: true);
        }
    }
}
