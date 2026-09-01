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
/// 4b · Bir programın etkin skorlama ağırlıklarını çözer:
/// programın kendi satırı → küresel satır (GrantId null) → <see cref="GrantMatchWeightSet.Default"/>.
///
/// <para>Tek kaynak olması önemli: ayarı hem host ekranı (4b), hem kiracı feed'i
/// (<c>GrantRecommendationAppService</c>), hem toplu gönderim (<c>GrantHostDispatchAppService</c>)
/// okuyor; kural üç yerde tekrarlansa sessizce ayrışırdı.</para>
/// </summary>
public class GrantMatchWeightResolver : DomainService
{
    private readonly IRepository<GrantMatchWeight, Guid> _weightRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantMatchWeightResolver(
        IRepository<GrantMatchWeight, Guid> weightRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _weightRepo = weightRepo;
        _mtFilter = mtFilter;
    }

    public async Task<GrantMatchWeightSet> ResolveAsync(Guid grantId)
        => (await ResolveManyAsync(new[] { grantId }))[grantId];

    public async Task<Dictionary<Guid, GrantMatchWeightSet>> ResolveManyAsync(IEnumerable<Guid> grantIds)
    {
        var ids = grantIds.Distinct().ToList();

        // Ayar host kataloğudur (TenantId null). Kiracı bağlamından da okunduğu için
        // filtre kapatılır; 🔴 kapsamın kiracılara açılmaması için TenantId == null
        // koşulu ELLE konur — aksi halde başka kiracının satırı okunabilirdi.
        List<GrantMatchWeight> rows;
        using (_mtFilter.Disable())
        {
            rows = await _weightRepo.GetListAsync(
                w => w.TenantId == null && (w.GrantId == null || ids.Contains(w.GrantId.Value)));
        }

        var global = rows.FirstOrDefault(r => r.GrantId == null)?.ToWeightSet()
                     ?? GrantMatchWeightSet.Default;
        var byGrant = rows
            .Where(r => r.GrantId != null)
            .GroupBy(r => r.GrantId!.Value)
            .ToDictionary(g => g.Key, g => g.First().ToWeightSet());

        return ids.ToDictionary(id => id, id => byGrant.TryGetValue(id, out var own) ? own : global);
    }
}
