using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Consents;

/// <summary>
/// <see cref="PlatformPermissions.Consents.Default"/> iznini host'un "admin" rolüne verir
/// (rıza analiz paneli <c>/Admin/Consent</c> buna bağlı).
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken seed edilir. Bu seeder olmadan, kurulu bir sistemde rıza analiz sayfası
/// deploy'dan sonra kimseye görünmez (bkz. FN-004; AI izin seed eksiğiyle aynı sınıf).
/// Aynı desen: <see cref="Apya.Platform.Accounts.LoginScreenPermissionDataSeedContributor"/>.
///
/// Yalnız HOST bağlamında (host "admin" rolü) çalışır; kiracı-admin erişimi paket izin tavanı
/// sistemi üzerinden ele alınır (ayrı karar). <see cref="IPermissionDataSeeder"/> var olan
/// grant'ları eleyerek ekler → tekrar tekrar çalıştırmak güvenli (idempotent).
/// </summary>
public class ConsentsPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public ConsentsPermissionDataSeedContributor(
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
            new[] { PlatformPermissions.Consents.Default },
            context.TenantId);
    }
}
