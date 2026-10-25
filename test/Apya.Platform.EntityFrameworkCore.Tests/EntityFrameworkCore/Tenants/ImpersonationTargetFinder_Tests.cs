using System;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// "Hesabına Gir" yalnız "root"/"admin" adlı kullanıcıyı arıyordu; kiracı yöneticisi kullanıcı
/// adını değiştirince ya da "admin"i silince host o kiracıya hiç giremiyordu. Ad bulunamazsa
/// "admin" rolündeki en eski aktif kullanıcıya düşülür.
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
    public async Task No_Admin_Name_And_No_Admin_Role_Member_Returns_Null()
    {
        var tenantId = await CreateTenantWithAdminRoleAsync();

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await CreateUserAsync(tenantId, "calisan", isAdmin: false);
            }
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                (await _finder.FindAsync()).ShouldBeNull();
            }
        });
    }

    private async Task<Guid> CreateTenantWithAdminRoleAsync()
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
                    new IdentityRole(Guid.NewGuid(), ImpersonationTargetFinder.AdminRoleName, tenantId) { IsStatic = true },
                    autoSave: true);
            }
        });

        return tenantId;
    }

    private async Task<IdentityUser> CreateUserAsync(Guid tenantId, string userName, bool isAdmin)
    {
        var user = new IdentityUser(Guid.NewGuid(), userName, $"{userName}-{Guid.NewGuid():N}@apya.test", tenantId);
        (await _userManager.CreateAsync(user)).Succeeded.ShouldBeTrue();
        if (isAdmin)
        {
            (await _userManager.AddToRoleAsync(user, ImpersonationTargetFinder.AdminRoleName)).Succeeded.ShouldBeTrue();
        }
        return user;
    }
}
