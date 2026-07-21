using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// Faz 2: Paket (edition) yönetimi — host. Paketlerin feature içeriklerini düzenler ve
/// istenirse o pakete sahip tenant'lara yeniden uygular. Host yetkisiyle (TenantManagement) korunur.
/// </summary>
[Authorize(TenantManagementPermissions.Tenants.Update)]
public class PackageAppService : PlatformAppService, IPackageAppService
{
    private readonly IRepository<PlatformPackage, Guid> _packageRepository;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly TenantPackageManager _packageManager;

    public PackageAppService(
        IRepository<PlatformPackage, Guid> packageRepository,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantPackageManager packageManager)
    {
        _packageRepository = packageRepository;
        _tenantProfileRepository = tenantProfileRepository;
        _packageManager = packageManager;
    }

    public async Task<List<PackageDto>> GetListAsync()
    {
        await _packageManager.EnsureDefaultPackagesAsync();
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Features);
        var list = await AsyncExecuter.ToListAsync(queryable.OrderBy(p => p.DisplayOrder));
        return list.Select(ToDto).ToList();
    }

    public async Task UpdateFeaturesAsync(UpdatePackageFeaturesDto input)
    {
        var pkg = await GetEntityAsync(input.Code);

        // Yalnız katalogdaki feature'ları işle; toggle'ı true/false, sayısalı pozitif int'e normalize et.
        foreach (var meta in PackageFeatureCatalog.Managed)
        {
            if (!input.Features.TryGetValue(meta.Name, out var raw)) { continue; }

            string value;
            if (meta.IsNumeric)
            {
                value = int.TryParse(raw, out var n) ? Math.Max(0, n).ToString() : "0";
            }
            else
            {
                var on = string.Equals(raw, "true", StringComparison.OrdinalIgnoreCase)
                         || raw == "on" || raw == "1";
                value = on ? "true" : "false";
            }

            pkg.SetFeature(GuidGenerator.Create(), meta.Name, value);
        }

        await _packageRepository.UpdateAsync(pkg, autoSave: true);
    }

    public async Task<int> ReapplyToTenantsAsync(PackageCode code)
    {
        var profiles = await _tenantProfileRepository.GetListAsync(p => p.PackageCode == code);
        foreach (var profile in profiles)
        {
            await _packageManager.ApplyPackageAsync(profile.TenantId, code);
        }
        return profiles.Count;
    }

    private async Task<PlatformPackage> GetEntityAsync(PackageCode code)
    {
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Features);
        var pkg = await AsyncExecuter.FirstOrDefaultAsync(queryable.Where(p => p.Code == code));
        if (pkg == null)
        {
            throw new UserFriendlyException($"Paket bulunamadı: {code}");
        }
        return pkg;
    }

    private static PackageDto ToDto(PlatformPackage p)
    {
        var stored = p.ToFeatureValues();
        return new PackageDto
        {
            Code = p.Code,
            Name = p.Name,
            Description = p.Description,
            DisplayOrder = p.DisplayOrder,
            Features = PackageFeatureCatalog.Managed.Select(m => new PackageFeatureDto
            {
                FeatureName = m.Name,
                DisplayName = m.DisplayName,
                IsNumeric = m.IsNumeric,
                Value = stored.TryGetValue(m.Name, out var v) ? v : (m.IsNumeric ? "0" : "false")
            }).ToList()
        };
    }
}
