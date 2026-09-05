using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talebi izinlerini host'un "admin" rolüne verir (<c>/Admin/RegistrationRequests</c> bunlara bağlı).
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken seed edilir. Bu seeder olmadan panel, kurulu bir sistemde deploy'dan sonra
/// kimseye görünmez. Aynı desen: <see cref="Apya.Platform.Consents.ConsentsPermissionDataSeedContributor"/>.
///
/// Yalnız HOST bağlamında çalışır: kayıt talebi henüz kiracı olmayan bir adaydan gelir,
/// kayıt host'a aittir; kiracıya taşınacak bir şey yoktur.
/// <see cref="IPermissionDataSeeder"/> var olan grant'ları eleyerek ekler → tekrar çalıştırmak güvenli.
///
/// <para>DİKKAT: izin adı <c>Platform.DemoRequests*</c>'ten değişti. Eski grant satırları
/// veritabanında kalır ama artık hiçbir izne karşılık gelmez; ABP tanınmayan grant'ı yok
/// sayar, temizlik ayrı bir iştir.</para>
/// </summary>
public class RegistrationRequestsPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public RegistrationRequestsPermissionDataSeedContributor(
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
                PlatformPermissions.RegistrationRequests.Default,
                PlatformPermissions.RegistrationRequests.Manage
            },
            context.TenantId);
    }
}
