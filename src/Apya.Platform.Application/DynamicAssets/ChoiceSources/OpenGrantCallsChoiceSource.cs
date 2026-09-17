using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Grants;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DynamicAssets.ChoiceSources;

/// <summary>
/// Başvuruya açık hibe çağrıları. Çağrı kapanınca listeden kendiliğinden düşer, yenisi yayınlanınca eklenir.
/// </summary>
[ExposeServices(typeof(IFormChoiceSource))]
public class OpenGrantCallsChoiceSource : IFormChoiceSource, ITransientDependency
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public OpenGrantCallsChoiceSource(
        IRepository<GrantCall, Guid> callRepository,
        IRepository<Grant, Guid> grantRepository,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _callRepository = callRepository;
        _grantRepository = grantRepository;
        _multiTenantFilter = multiTenantFilter;
    }

    public string Key => FormChoiceSources.OpenGrantCalls;

    public FormChoiceSourceScope Scope => FormChoiceSourceScope.HostCatalog;

    public async Task<List<FormChoiceDto>> GetAsync(string? parentValue)
    {
        List<GrantCall> calls;
        Dictionary<Guid, Grant> grants;
        // Katalog host'undur; form kiracıda ya da anonim açılabilir. Süzgeç kapatılınca kapsam TÜM
        // kiracılara genişler, bu yüzden TenantId == null elle konur.
        using (_multiTenantFilter.Disable())
        {
            calls = await _callRepository.GetListAsync(c => c.TenantId == null && c.Status == GrantCallStatus.Acik);
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            grants = (await _grantRepository.GetListAsync(g => g.TenantId == null && grantIds.Contains(g.Id)))
                .ToDictionary(g => g.Id);
        }

        return calls
            .Where(c => grants.ContainsKey(c.GrantId))
            .Select(c => new FormChoiceDto { Value = c.Id.ToString(), Label = LabelOf(grants[c.GrantId], c) })
            .OrderBy(c => c.Label, StringComparer.Create(Turkish, ignoreCase: true))
            .ToList();
    }

    public async Task<int?> CountAsync() => (await GetAsync(null)).Count;

    private static string LabelOf(Grant grant, GrantCall call) => $"{grant.Issuer} · {grant.Name} ({call.Period})";
}
