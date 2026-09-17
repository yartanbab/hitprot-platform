using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.DynamicAssets.ChoiceSources;

/// <summary>
/// 16a · Firma (kiracı) kayıtları — host formları için. 🔴 Liste yalnız HOST bağlamında döner: kiracı
/// kullanıcısı host formunu doldururken bütün firmaların adını görmemeli.
/// </summary>
[ExposeServices(typeof(IFormChoiceSource))]
public class FirmsChoiceSource : IFormChoiceSource, ITransientDependency
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public FirmsChoiceSource(ITenantRepository tenantRepository, ICurrentTenant currentTenant)
    {
        _tenantRepository = tenantRepository;
        _currentTenant = currentTenant;
    }

    public string Key => FormChoiceSources.Firms;

    public FormChoiceSourceScope Scope => FormChoiceSourceScope.HostOnly;

    public async Task<List<FormChoiceDto>> GetAsync(string? parentValue)
    {
        if (_currentTenant.Id != null)
        {
            return new List<FormChoiceDto>();
        }

        return (await _tenantRepository.GetListAsync())
            .Select(t => new FormChoiceDto { Value = t.Id.ToString(), Label = t.Name })
            .OrderBy(c => c.Label, StringComparer.Create(Turkish, ignoreCase: true))
            .ToList();
    }

    public async Task<int?> CountAsync() => _currentTenant.Id == null ? (await GetAsync(null)).Count : null;
}
