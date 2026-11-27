using System;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// SALT OKUNUR BAYRAĞI SÖZLEŞMESİ: varsayılan kapalı, elle açılır, paket uygulanınca kapanır
/// ve host bağlamında hiçbir zaman "açık" okunmaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ReadOnlyFeature_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly TenantPackageManager _packageManager;
    private readonly IFeatureChecker _featureChecker;
    private readonly ICurrentTenant _currentTenant;

    public ReadOnlyFeature_Tests()
    {
        _packageManager = GetRequiredService<TenantPackageManager>();
        _featureChecker = GetRequiredService<IFeatureChecker>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<bool> IsReadOnlyInTenantAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _featureChecker.IsEnabledAsync(PlatformFeatures.ReadOnly);
        }
    }

    [Fact]
    public async Task ReadOnly_Defaults_To_False_For_Tenant()
    {
        var tenantId = Guid.NewGuid();

        (await WithUnitOfWorkAsync(() => IsReadOnlyInTenantAsync(tenantId))).ShouldBeFalse();
        (await WithUnitOfWorkAsync(() => _packageManager.IsReadOnlyAsync(tenantId))).ShouldBeFalse();
    }

    [Fact]
    public async Task SetReadOnly_Makes_Tenant_ReadOnly()
    {
        var tenantId = Guid.NewGuid();

        await WithUnitOfWorkAsync(() => _packageManager.SetReadOnlyAsync(tenantId, true));

        (await WithUnitOfWorkAsync(() => IsReadOnlyInTenantAsync(tenantId))).ShouldBeTrue();
        (await WithUnitOfWorkAsync(() => _packageManager.IsReadOnlyAsync(tenantId))).ShouldBeTrue();
    }

    [Fact]
    public async Task ApplyPackage_Clears_ReadOnly()
    {
        var tenantId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            await _packageManager.SetReadOnlyAsync(tenantId, true);
        });

        await WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Standard));

        (await WithUnitOfWorkAsync(() => IsReadOnlyInTenantAsync(tenantId))).ShouldBeFalse();
    }

    /// <summary>
    /// HostFeatureValueProvider host'ta Platform.* toggle'larına "true" döner; bu bayrak hariç
    /// tutulmasaydı host kendini salt okunur sayardı.
    /// </summary>
    [Fact]
    public async Task Host_Context_Never_Reads_ReadOnly_As_True()
    {
        (await WithUnitOfWorkAsync(() => _featureChecker.IsEnabledAsync(PlatformFeatures.ReadOnly)))
            .ShouldBeFalse();
    }
}
