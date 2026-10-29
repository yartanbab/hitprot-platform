using System;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// "Hesabına Gir" kullanıcı ve rol ADINA bakıyordu; kiracı adları değiştirince ya da yönetici
/// rolünü silince host o kiracıya giremiyordu. Ad tutmazsa statik rol, sonra izin yönetme
/// yetkisi, en son kiracının en eski aktif kullanıcısı denenir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ImpersonationTargetFinder_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ImpersonationTargetFinder _finder;
    private readonly IdentityUserManager _userManager;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ICurrentTenant _currentTenant;

    public ImpersonationTargetFinder_Tests()
    {
        _finder = GetRequiredService<ImpersonationTargetFinder>();
        _userManager = GetRequiredService<IdentityUserManager>();
        _roleRepository = GetRequiredService<IIdentityRoleRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    [Fact]
    public async Task Admin_Renamed_Falls_Back_To_Oldest_Active_Admin_Role_Member()
    {
        var tenantId = await CreateTenantWithAdminRoleAsync();
        Guid expectedId = default;

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                // En eski yönetici pasif: seçilmemeli.
                var inactive = await CreateUserAsync(tenantId, "eski-yonetici", isAdmin: true);
                inactive.SetIsActive(false);
                (await _userManager.UpdateAsync(inactive)).Succeeded.ShouldBeTrue();

                expectedId = (await CreateUserAsync(tenantId, "ayse.yilmaz", isAdmin: true)).Id;
                await CreateUserAsync(tenantId, "yeni-yonetici", isAdmin: true);
                await CreateUserAsync(tenantId, "calisan", isAdmin: false);
            }
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var target = await _finder.FindAsync();
                target.ShouldNotBeNull();
                target!.Id.ShouldBe(expectedId);
            }
        });
    }

    [Fact]
    public async Task User_Named_Admin_Still_Wins()
    {
        var tenantId = await CreateTenantWithAdminRoleAsync();
        Guid adminId = default;

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await CreateUserAsync(tenantId, "ayse.yilmaz", isAdmin: true);
                adminId = (await CreateUserAsync(tenantId, "admin", isAdmin: false)).Id;
            }
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                (await _finder.FindAsync())!.Id.ShouldBe(adminId);
            }
        });
    }

    [Fact]
    public async Task Renamed_Static_Admin_Role_Still_Found()
    {
        // Rol adı "admin" değil ama kurulumdaki statik yönetici rolü: ada değil işarete bakılır.
        var tenantId = await CreateTenantWithRoleAsync("Yönetim", isStatic: true);
        Guid expectedId = default;

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await CreateUserAsync(tenantId, "calisan", roleName: null);
                expectedId = (await CreateUserAsync(tenantId, "ayse.yilmaz", roleName: "Yönetim")).Id;
            }
        });

        (await FindInTenantAsync(tenantId))!.Id.ShouldBe(expectedId);
    }

    [Fact]
    public async Task Deleted_Admin_Role_Falls_Back_To_Role_That_Manages_Permissions()
    {
        // Yönetici rolü yok; yöneticiler izin yönetebilen başka bir role taşınmış.
        var tenantId = await CreateTenantWithRoleAsync("Kurucular", isStatic: false);
        Guid expectedId = default;

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await GetRequiredService<IPermissionGrantRepository>().InsertAsync(
                    new PermissionGrant(Guid.NewGuid(), ImpersonationTargetFinder.AdminPermissionName,
                        RolePermissionValueProvider.ProviderName, "Kurucular", tenantId),
                    autoSave: true);

                // Daha eski ama yönetici olmayan kullanıcı seçilmemeli.
                await CreateUserAsync(tenantId, "calisan", roleName: null);
                expectedId = (await CreateUserAsync(tenantId, "ayse.yilmaz", roleName: "Kurucular")).Id;
            }
        });

        (await FindInTenantAsync(tenantId))!.Id.ShouldBe(expectedId);
    }

    [Fact]
    public async Task No_Admin_Anywhere_Falls_Back_To_Oldest_Active_User()
    {
        var tenantId = await CreateTenantWithRoleAsync("Çalışan", isStatic: false);
        Guid expectedId = default;

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var inactive = await CreateUserAsync(tenantId, "ayrilan", roleName: null);
                inactive.SetIsActive(false);
                (await _userManager.UpdateAsync(inactive)).Succeeded.ShouldBeTrue();

                expectedId = (await CreateUserAsync(tenantId, "kurucu", roleName: "Çalışan")).Id;
                await CreateUserAsync(tenantId, "calisan", roleName: "Çalışan");
            }
        });

        (await FindInTenantAsync(tenantId))!.Id.ShouldBe(expectedId);
    }

    [Fact]
    public async Task No_Active_User_Returns_Null()
    {
        var tenantId = await CreateTenantWithAdminRoleAsync();

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var inactive = await CreateUserAsync(tenantId, "ayrilan", isAdmin: true);
                inactive.SetIsActive(false);
                (await _userManager.UpdateAsync(inactive)).Succeeded.ShouldBeTrue();
            }
        });

        (await FindInTenantAsync(tenantId)).ShouldBeNull();
    }

    private Task<IdentityUser?> FindInTenantAsync(Guid tenantId)
    {
        return WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await _finder.FindAsync();
            }
        });
    }

    private Task<Guid> CreateTenantWithAdminRoleAsync()
    {
        return CreateTenantWithRoleAsync(ImpersonationTargetFinder.AdminRoleName, isStatic: true);
    }

    private async Task<Guid> CreateTenantWithRoleAsync(string roleName, bool isStatic)
    {
        var tenantId = await WithUnitOfWorkAsync(async () =>
        {
            var tenant = await GetRequiredService<ITenantManager>()
                .CreateAsync("burunme-" + Guid.NewGuid().ToString("N")[..8]);
            await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
            return tenant.Id;
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await _roleRepository.InsertAsync(
                    new IdentityRole(Guid.NewGuid(), roleName, tenantId) { IsStatic = isStatic },
                    autoSave: true);
            }
        });

        return tenantId;
    }

    private Task<IdentityUser> CreateUserAsync(Guid tenantId, string userName, bool isAdmin)
    {
        return CreateUserAsync(tenantId, userName, isAdmin ? ImpersonationTargetFinder.AdminRoleName : null);
    }

    private async Task<IdentityUser> CreateUserAsync(Guid tenantId, string userName, string? roleName)
    {
        var user = new IdentityUser(Guid.NewGuid(), userName, $"{userName}-{Guid.NewGuid():N}@apya.test", tenantId);
        (await _userManager.CreateAsync(user)).Succeeded.ShouldBeTrue();
        if (roleName != null)
        {
            (await _userManager.AddToRoleAsync(user, roleName)).Succeeded.ShouldBeTrue();
        }
        return user;
    }
}
