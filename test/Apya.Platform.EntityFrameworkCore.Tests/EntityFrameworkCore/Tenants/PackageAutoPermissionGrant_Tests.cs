using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// KİLİT SÖZLEŞME: paketle bir modül AÇILDIĞINDA o modülün izinleri kiracının statik admin
/// rolüne otomatik verilir.
/// <para>
/// Regresyon kaynağı: <c>IFeatureManager</c> yalnız feature değeri yazar, izin vermez. Bu adım
/// olmadan paket yükseltilince modülün izin kutuları yetki ekranında belirir ama BOŞ gelir —
/// biri elle işaretleyip kaydedene kadar kenar çubuğunda hiçbir şey çıkmaz. Kullanıcıya bu,
/// "paketi açtım ama menüde görünmüyor" olarak yansıyordu.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PackageAutoPermissionGrant_Tests : PlatformEntityFrameworkCoreTestBase
{
    /// <summary>
    /// Rol izin sağlayıcısının adı. Sabitin sahibi <c>RolePermissionValueProvider</c>, ayrı bir
    /// ABP paketinde yaşar ve bu test projesine referanslı değil; değeri sözleşmenin parçası.
    /// </summary>
    private const string RoleProvider = "R";

    private readonly TenantPackageManager _packageManager;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionGrantRepository _permissionGrantRepository;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly IPermissionManager _permissionManager;

    public PackageAutoPermissionGrant_Tests()
    {
        _packageManager = GetRequiredService<TenantPackageManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _permissionGrantRepository = GetRequiredService<IPermissionGrantRepository>();
        _roleRepository = GetRequiredService<IIdentityRoleRepository>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _permissionManager = GetRequiredService<IPermissionManager>();
    }

    /// <summary>
    /// Paket izin tavanı profilden okunur ve profilsiz tenant Basic sayılır
    /// (<c>PackageCeilingStore.GetPackageCodeAsync</c>), bu yüzden gerçek akıştaki gibi profil
    /// kurulur — aksi halde tavan izni keser ve ölçüm yanıltıcı olur.
    /// </summary>
    private async Task SetProfilePackageAsync(Guid tenantId, PackageCode code)
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var profile = await _profileRepository.FindAsync(p => p.TenantId == tenantId);
            if (profile == null)
            {
                profile = new TenantProfile(Guid.NewGuid(), tenantId, CompanyType.Company, "1234567890", "a@b.com");
                profile.SetPackage(code);
                await _profileRepository.InsertAsync(profile, autoSave: true);
                return;
            }

            profile.SetPackage(code);
            await _profileRepository.UpdateAsync(profile, autoSave: true);
        });
    }

    private async Task CreateStaticAdminRoleAsync(Guid tenantId, string roleName)
    {
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await _roleRepository.InsertAsync(
                    new IdentityRole(Guid.NewGuid(), roleName, tenantId) { IsStatic = true, IsPublic = true },
                    autoSave: true);
            }
        });
    }

    /// <summary>
    /// Rolde grant KAYDI var mı — <c>IPermissionManager.GetForRoleAsync</c> değil: o, sonuca
    /// feature/tavan state checker'larını da karıştırır ve burada ölçmek istediğimiz şey
    /// yalnızca "izin role yazıldı mı" sorusudur.
    /// </summary>
    private Task<bool> IsGrantedForRoleAsync(Guid tenantId, string roleName, string permissionName)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var grant = await _permissionGrantRepository.FindAsync(
                    permissionName, RoleProvider, roleName);
                return grant != null;
            }
        });

    [Fact]
    public async Task Opening_A_Module_Should_Grant_Its_Permissions_To_The_Static_Admin_Role()
    {
        var tenantId = Guid.NewGuid();
        await CreateStaticAdminRoleAsync(tenantId, "admin");

        // Basic: hibe modülü kapalı → izin verilmez.
        await SetProfilePackageAsync(tenantId, PackageCode.Basic);
        await WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Basic));
        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Grants.Default))
            .ShouldBeFalse();

        // Standard: hibe modülü açılır → izin otomatik verilir.
        await SetProfilePackageAsync(tenantId, PackageCode.Standard);
        await WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Standard));
        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Grants.Default))
            .ShouldBeTrue();

        // Ve izin yalnız kayıtlı değil, ETKİLİ olmalı: feature + paket tavanı + grant zincirinin
        // üçü birden geçmezse kenar çubuğunda "Hibe Yönetimi" yine çıkmaz.
        var effective = await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await _permissionManager.GetForRoleAsync("admin", PlatformPermissions.Grants.Default);
            }
        });
        effective.IsGranted.ShouldBeTrue();
    }

    /// <summary>
    /// Yalnız YENİ açılan modüller işlenir: zaten açık bir modülde host'un bilinçli olarak
    /// kaldırdığı izin, paket tekrar uygulandığında geri gelmemelidir.
    /// </summary>
    [Fact]
    public async Task Reapplying_The_Same_Package_Should_Not_Resurrect_Revoked_Permissions()
    {
        var tenantId = Guid.NewGuid();
        await CreateStaticAdminRoleAsync(tenantId, "admin");

        await WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Basic));
        await WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Standard));
        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Grants.Default))
            .ShouldBeTrue();

        // Host izni bilinçli olarak kaldırır.
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var grant = await _permissionGrantRepository.FindAsync(
                    PlatformPermissions.Grants.Default, RoleProvider, "admin");
                await _permissionGrantRepository.DeleteAsync(grant!, autoSave: true);
            }
        });

        // Aynı paket yeniden uygulanır: hibe modülü zaten açıktı, geri verilmemeli.
        await WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Standard));
        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Grants.Default))
            .ShouldBeFalse();
    }

    /// <summary>
    /// Statik admin rolü olmayan kiracı (özel rol setiyle kurulmuş) sessizce atlanır —
    /// paket uygulama patlamaz, izinleri host yetki ekranından dağıtır.
    /// </summary>
    [Fact]
    public async Task Tenant_Without_A_Static_Admin_Role_Should_Not_Break_Package_Apply()
    {
        var tenantId = Guid.NewGuid();
        await CreateStaticAdminRoleAsync(tenantId, "CEO");

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var role = await _roleRepository.FindByNormalizedNameAsync("CEO");
                role!.IsStatic = false;
                await _roleRepository.UpdateAsync(role, autoSave: true);
            }
        });

        await Should.NotThrowAsync(
            () => WithUnitOfWorkAsync(() => _packageManager.ApplyPackageAsync(tenantId, PackageCode.Standard)));

        (await IsGrantedForRoleAsync(tenantId, "CEO", PlatformPermissions.Grants.Default))
            .ShouldBeFalse();
    }
}
