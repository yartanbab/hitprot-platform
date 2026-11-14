using System;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// İçe/dışa aktarma izinleri kurulu sistemlere nasıl ulaşır: telafi, bugün aktarım yapabilen role
/// ilgili izni verir (modülü gören → dışa aktarma, modülde kayıt açabilen → içe aktarma). Böylece
/// host "aktarım izinlerini uygula" anahtarını açtığında kimse yapabildiği işi kaybetmez. Telafi
/// yalnız BİR KEZ koşar: bir rolden bilerek kaldırılan izin geri gelmemeli.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DataTransferPermissionBackfill_Tests : PlatformEntityFrameworkCoreTestBase
{
    /// <summary>Rol izin sağlayıcısının adı (bkz. <c>TaskSharePermissionGap_Tests</c>).</summary>
    private const string RoleProvider = "R";

    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionGrantRepository _grantRepository;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly DataTransferPermissionDataSeedContributor _seeder;

    public DataTransferPermissionBackfill_Tests()
    {
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _grantRepository = GetRequiredService<IPermissionGrantRepository>();
        _permissionDataSeeder = GetRequiredService<IPermissionDataSeeder>();
        _roleRepository = GetRequiredService<IIdentityRoleRepository>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _seeder = GetRequiredService<DataTransferPermissionDataSeedContributor>();
    }

    /// <summary>
    /// Kurulu bir kiracı: "muhasebe" gider görüyor ve giriyor, "izleyici" yalnız görevleri görüyor,
    /// "bos" rolünün aktarımı olan hiçbir modülde izni yok.
    /// </summary>
    private async Task<Guid> CreateLegacyTenantAsync(string name)
    {
        var tenantId = await WithUnitOfWorkAsync(async () =>
        {
            var tenant = await _tenantManager.CreateAsync(name);
            await _tenantRepository.InsertAsync(tenant, autoSave: true);
            return tenant.Id;
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await _roleRepository.InsertAsync(new IdentityRole(Guid.NewGuid(), "muhasebe", tenantId), autoSave: true);
                await _roleRepository.InsertAsync(new IdentityRole(Guid.NewGuid(), "izleyici", tenantId), autoSave: true);
                await _roleRepository.InsertAsync(new IdentityRole(Guid.NewGuid(), "bos", tenantId), autoSave: true);

                await _permissionDataSeeder.SeedAsync(RoleProvider, "muhasebe",
                    new[] { PlatformPermissions.Expenses.Default, PlatformPermissions.Expenses.Create }, tenantId);
                await _permissionDataSeeder.SeedAsync(RoleProvider, "izleyici",
                    new[] { PlatformPermissions.Tasks.Default }, tenantId);
                await _permissionDataSeeder.SeedAsync(RoleProvider, "bos",
                    new[] { PlatformPermissions.Notifications.Default }, tenantId);
            }
        });

        return tenantId;
    }

    private Task<bool> HasGrantAsync(Guid tenantId, string roleName, string permission)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await _grantRepository.FindAsync(permission, RoleProvider, roleName) != null;
            }
        });

    private Task SeedAsHostAsync() => WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

    /// <summary>
    /// "Bu yayından önceki sistem": test barındırıcısı açılışta bütün tohumlayıcıları bir kez
    /// koşturduğu için işaret zaten "yapıldı"dır; geri alınır.
    /// </summary>
    private Task ResetBackfillFlagAsync() => WithUnitOfWorkAsync(() =>
        GetRequiredService<ISettingManager>().SetGlobalAsync(PlatformSettings.Backfills.DataTransferPermissionsGranted, null));

    [Fact]
    public async Task Telafi_goren_role_disa_kayit_acabilen_role_ice_aktarma_iznini_verir()
    {
        var tenantId = await CreateLegacyTenantAsync("aktarim-izni-telafi");
        await ResetBackfillFlagAsync();

        await SeedAsHostAsync();

        (await HasGrantAsync(tenantId, "muhasebe", PlatformPermissions.DataTransfer.Default)).ShouldBeTrue();
        (await HasGrantAsync(tenantId, "muhasebe", PlatformPermissions.DataTransfer.Export)).ShouldBeTrue();
        (await HasGrantAsync(tenantId, "muhasebe", PlatformPermissions.DataTransfer.Import)).ShouldBeTrue();

        (await HasGrantAsync(tenantId, "izleyici", PlatformPermissions.DataTransfer.Export)).ShouldBeTrue();
        (await HasGrantAsync(tenantId, "izleyici", PlatformPermissions.DataTransfer.Import))
            .ShouldBeFalse("görev açamayan rol içe aktaramıyordu; izin de almaz");

        (await HasGrantAsync(tenantId, "bos", PlatformPermissions.DataTransfer.Default))
            .ShouldBeFalse("aktarımı olan hiçbir modülü göremeyen role izin verilmez");

        // Denetimi açıp kapatma izni kiracıya hiç verilmez.
        (await HasGrantAsync(tenantId, "muhasebe", PlatformPermissions.DataTransfer.ManageAccess)).ShouldBeFalse();
    }

    [Fact]
    public async Task Rolden_kaldirilan_izin_sonraki_yayinda_geri_gelmez()
    {
        var tenantId = await CreateLegacyTenantAsync("aktarim-izni-tek-sefer");
        await ResetBackfillFlagAsync();
        await SeedAsHostAsync();

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var grant = await _grantRepository.FindAsync(PlatformPermissions.DataTransfer.Import, RoleProvider, "muhasebe");
                await _grantRepository.DeleteAsync(grant!, autoSave: true);
            }
        });

        await SeedAsHostAsync();

        (await HasGrantAsync(tenantId, "muhasebe", PlatformPermissions.DataTransfer.Import)).ShouldBeFalse();
        (await HasGrantAsync(tenantId, "muhasebe", PlatformPermissions.DataTransfer.Export)).ShouldBeTrue();
    }

    /// <summary>Kiracı izinleri her paketin tavanına girer; denetim anahtarı izni yalnız host'tadır.</summary>
    [Fact]
    public async Task Kiraci_izinleri_her_paket_tavaninda_anahtar_izni_yalniz_hostta()
    {
        var tenantSide = await GetRequiredService<TenantPackageManager>().GetTenantPermissionNamesAsync();
        var definitions = GetRequiredService<IPermissionDefinitionManager>();

        foreach (var name in new[]
                 {
                     PlatformPermissions.DataTransfer.Default,
                     PlatformPermissions.DataTransfer.Export,
                     PlatformPermissions.DataTransfer.Import
                 })
        {
            tenantSide.ShouldContain(name);
            foreach (var package in Enum.GetValues<PackageCode>())
            {
                PackagePermissionDefaults.IsIncluded(package, name).ShouldBeTrue($"{package}: {name}");
            }
        }

        tenantSide.ShouldNotContain(PlatformPermissions.DataTransfer.ManageAccess);
        (await definitions.GetAsync(PlatformPermissions.DataTransfer.ManageAccess)).MultiTenancySide.ShouldBe(MultiTenancySides.Host);
    }
}
