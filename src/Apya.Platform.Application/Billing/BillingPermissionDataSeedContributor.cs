using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Billing;

/// <summary>
/// Faturalama izinlerini host'un "admin" rolüne verir (<c>/Admin/Billing</c> bunlara bağlı).
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken seed edilir. Bu seeder olmadan panel, kurulu bir sistemde deploy'dan sonra
/// kimseye görünmez. Aynı desen: <see cref="Apya.Platform.RegistrationRequests.RegistrationRequestsPermissionDataSeedContributor"/>.
///
/// Yalnız HOST bağlamında çalışır: fatura PARGETTO'nun kiracıya kestiği belgedir, kiracıya
/// taşınacak bir yetki yoktur (kiracı kendi faturasını TenantSettings izniyle okur).
/// </summary>
public class BillingPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public BillingPermissionDataSeedContributor(
        IPermissionDataSeeder permissionDataSeeder,
        IIdentityRoleRepository roleRepository)
    {
        _permissionDataSeeder = permissionDataSeeder;
        _roleRepository = roleRepository;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        var adminRole = await _roleRepository.FindByNormalizedNameAsync("ADMIN");
        if (adminRole == null)
        {
            return;
        }

        await _permissionDataSeeder.SeedAsync(
            RolePermissionValueProvider.ProviderName,
            adminRole.Name,
            new[]
            {
                PlatformPermissions.Billing.Default,
                PlatformPermissions.Billing.Manage
            },
            context.TenantId);
    }
}
