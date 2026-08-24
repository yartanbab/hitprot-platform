using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// KİLİT SÖZLEŞME: hibe programını ve çağrısını yalnız HOST açar. Kiracı kendisine
/// yayınlananı görüntüler ve başvurur; katalogu yazamaz.
/// <para>
/// Regresyon kaynağı: <c>GrantAppService</c>/<c>GrantCallAppService</c> düz
/// <c>CrudAppService</c>'tir ve kiracı bağlamında da çalışır. Yazma izinleri Both tarafında
/// tanımlıyken bu izne sahip bir kiracı kullanıcısı, ekranda buton olmasa bile
/// <c>/api/app/grant</c> üzerinden kendi kiracısında program/çağrı açabiliyordu.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantHostOnlyPermissions_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly TenantPackageManager _packageManager;

    public GrantHostOnlyPermissions_Tests()
    {
        _permissionDefinitionManager = GetRequiredService<IPermissionDefinitionManager>();
        _packageManager = GetRequiredService<TenantPackageManager>();
    }

    [Theory]
    [InlineData(PlatformPermissions.Grants.Create)]
    [InlineData(PlatformPermissions.Grants.Edit)]
    [InlineData(PlatformPermissions.Grants.Delete)]
    public async Task Catalog_Write_Permissions_Should_Be_Host_Only(string permissionName)
    {
        var definition = await _permissionDefinitionManager.GetAsync(permissionName);

        definition.MultiTenancySide.ShouldBe(MultiTenancySides.Host);
        definition.MultiTenancySide.HasFlag(MultiTenancySides.Tenant).ShouldBeFalse();
    }

    [Fact]
    public async Task Grant_Viewing_Should_Stay_Available_To_Tenants()
    {
        var definition = await _permissionDefinitionManager.GetAsync(PlatformPermissions.Grants.Default);

        definition.MultiTenancySide.HasFlag(MultiTenancySides.Tenant).ShouldBeTrue();
    }

    /// <summary>
    /// Paket izin tavanının evreni yalnız tenant tarafındaki izinlerden oluşur; katalog yazma
    /// izinleri host-only olduğu için tavandan da, kiracının yetki ekranından da düşer.
    /// </summary>
    [Fact]
    public async Task Tenant_Permission_Universe_Should_Exclude_Catalog_Writes()
    {
        var tenantPermissions = await _packageManager.GetTenantPermissionNamesAsync();

        tenantPermissions.ShouldContain(PlatformPermissions.Grants.Default);
        tenantPermissions.ShouldNotContain(PlatformPermissions.Grants.Create);
        tenantPermissions.ShouldNotContain(PlatformPermissions.Grants.Edit);
        tenantPermissions.ShouldNotContain(PlatformPermissions.Grants.Delete);
    }
}
