using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.FeatureManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// Tenant'a paket (edition) uygular: paketin feature değer setini tenant'ın feature
/// değerleri olarak yazar (provider "T", key = tenantId). Feature'lar da permission
/// tavanını belirler (PlatformPermissionDefinitionProvider.RequireFeatures).
/// </summary>
public class TenantPackageManager : ITransientDependency
{
    private readonly IFeatureManager _featureManager;

    public TenantPackageManager(IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }

    public async Task ApplyPackageAsync(Guid tenantId, PackageCode packageCode)
    {
        var values = PackageDefinitions.For(packageCode);
        foreach (var kv in values)
        {
            await _featureManager.SetAsync(
                kv.Key,
                kv.Value,
                TenantFeatureValueProvider.ProviderName,
                tenantId.ToString());
        }
    }
}
