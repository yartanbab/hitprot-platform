using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.SimpleStateChecking;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// Firma tarafının hibe yazma izni (<see cref="PlatformPermissions.Grants.ManageApplications"/>)
/// kurulu sistemlere nasıl ulaşır (ürün kararı 2026-10-13, A yolu).
///
/// <para>Yazma uçları yeni izni şart koşunca, telafi olmasaydı yayından sonra hiçbir firma
/// kullanıcısı ilgi bildiremez, başvuru gönderemezdi. Telafi, hibeleri GÖREBİLEN her role izni
/// verir — ve yalnız BİR KEZ: sonradan bir rolden bilerek kaldırılan izin geri gelmemeli.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantManageApplicationsBackfill_Tests : PlatformEntityFrameworkCoreTestBase
{
    /// <summary>Rol izin sağlayıcısının adı (bkz. <c>TaskSharePermissionGap_Tests</c>).</summary>
    private const string RoleProvider = "R";
    private const string Permission = PlatformPermissions.Grants.ManageApplications;

    private readonly TenantPackageManager _packageManager;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionGrantRepository _grantRepository;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly ISimpleStateCheckerManager<PermissionDefinition> _stateCheckerManager;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly GrantManageApplicationsPermissionDataSeedContributor _seeder;

    public GrantManageApplicationsBackfill_Tests()
    {
        _packageManager = GetRequiredService<TenantPackageManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _grantRepository = GetRequiredService<IPermissionGrantRepository>();
        _permissionDataSeeder = GetRequiredService<IPermissionDataSeeder>();
        _permissionDefinitionManager = GetRequiredService<IPermissionDefinitionManager>();
        _stateCheckerManager = GetRequiredService<ISimpleStateCheckerManager<PermissionDefinition>>();
        _roleRepository = GetRequiredService<IIdentityRoleRepository>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _seeder = GetRequiredService<GrantManageApplicationsPermissionDataSeedContributor>();
    }

    /// <summary>
    /// Kurulu bir kiracı: "admin" ve "uzman" hibeleri görebiliyor, "muhasebe" göremiyor. Hiçbirinde
    /// yeni izin yok.
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
                await _roleRepository.InsertAsync(
                    new IdentityRole(Guid.NewGuid(), "admin", tenantId) { IsStatic = true, IsPublic = true }, autoSave: true);
                await _roleRepository.InsertAsync(new IdentityRole(Guid.NewGuid(), "uzman", tenantId), autoSave: true);
                await _roleRepository.InsertAsync(new IdentityRole(Guid.NewGuid(), "muhasebe", tenantId), autoSave: true);

                var view = new[] { PlatformPermissions.Grants.Default };
                await _permissionDataSeeder.SeedAsync(RoleProvider, "admin", view, tenantId);
                await _permissionDataSeeder.SeedAsync(RoleProvider, "uzman", view, tenantId);
            }
        });

        await WithUnitOfWorkAsync(async () =>
        {
            var profile = new TenantProfile(Guid.NewGuid(), tenantId, CompanyType.Company, "1234567890", "a@b.com");
            profile.SetPackage(PackageCode.Standard);
            await _profileRepository.InsertAsync(profile, autoSave: true);
        });

        return tenantId;
    }

    private Task<bool> HasGrantAsync(Guid tenantId, string roleName)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await _grantRepository.FindAsync(Permission, RoleProvider, roleName) != null;
            }
        });

    private Task SeedAsHostAsync() => WithUnitOfWorkAsync(() => _seeder.SeedAsync(new DataSeedContext()));

    /// <summary>
    /// "Bu yayından önceki sistem": telafi henüz koşmamış. Test barındırıcısı açılışta bütün
    /// tohumlayıcıları (boş veritabanında) bir kez koşturduğu için işaret zaten "yapıldı"dır.
    /// </summary>
    private Task ResetBackfillFlagAsync() => WithUnitOfWorkAsync(() =>
        GetRequiredService<Volo.Abp.SettingManagement.ISettingManager>().SetGlobalAsync(
            Apya.Platform.Settings.PlatformSettings.Backfills.GrantManageApplicationsGranted, null));

    [Fact]
    public async Task Yayin_telafisi_hibeleri_gorebilen_her_role_izni_verir_goremeyene_vermez()
    {
        var tenantId = await CreateLegacyTenantAsync("hibe-izni-telafi");
        await ResetBackfillFlagAsync();

        await SeedAsHostAsync();

        (await HasGrantAsync(tenantId, "admin")).ShouldBeTrue();
        (await HasGrantAsync(tenantId, "uzman")).ShouldBeTrue("özel rol de hibeleri görebiliyordu, yazabiliyordu");
        (await HasGrantAsync(tenantId, "muhasebe")).ShouldBeFalse("hibeleri göremeyen role izin verilmez");
    }

    /// <summary>
    /// Telafi bir kez koşar. Ürün sahibi salt-okur kalmasını istediği rolden izni kaldırır; sonraki
    /// yayın onu geri getirirse karar boşa çıkar.
    /// </summary>
    [Fact]
    public async Task Rolden_kaldirilan_izin_sonraki_yayinda_geri_gelmez()
    {
        var tenantId = await CreateLegacyTenantAsync("hibe-izni-tek-sefer");
        await ResetBackfillFlagAsync();
        await SeedAsHostAsync();

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var grant = await _grantRepository.FindAsync(Permission, RoleProvider, "uzman");
                await _grantRepository.DeleteAsync(grant!, autoSave: true);
            }
        });

        await SeedAsHostAsync();

        (await HasGrantAsync(tenantId, "uzman")).ShouldBeFalse();
        (await HasGrantAsync(tenantId, "admin")).ShouldBeTrue();
    }

    /// <summary>Grant tek başına yetmez: izin paket tavanından da geçmeli (hibesi açık pakette).</summary>
    [Fact]
    public async Task Izin_hibesi_acik_paketin_tavanindan_gecer_kapali_pakette_gecmez()
    {
        var tenantId = await CreateLegacyTenantAsync("hibe-izni-tavan");
        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());

        PackagePermissionDefaults.IsIncluded(PackageCode.Standard, Permission).ShouldBeTrue();
        PackagePermissionDefaults.IsIncluded(PackageCode.Basic, Permission).ShouldBeFalse();

        var enabled = await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var definition = await _permissionDefinitionManager.GetAsync(Permission);
                return await _stateCheckerManager.IsEnabledAsync(definition);
            }
        });
        enabled.ShouldBeTrue();
    }

    /// <summary>İzin kiracıya özeldir: host'ta karşılığı Grants.Edit'tir.</summary>
    [Fact]
    public async Task Izin_yalniz_kiraci_tarafinda_tanimlidir()
    {
        var definition = await _permissionDefinitionManager.GetAsync(Permission);

        definition.MultiTenancySide.ShouldBe(MultiTenancySides.Tenant);
        (await _packageManager.GetTenantPermissionNamesAsync()).ShouldContain(Permission);
    }
}
