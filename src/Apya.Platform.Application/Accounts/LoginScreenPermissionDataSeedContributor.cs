using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Accounts;

/// <summary>
/// <see cref="PlatformPermissions.LoginScreen.Default"/> iznini host'un "admin" rolüne verir.
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken seed edilir. Bu seeder olmadan, kurulu bir sistemde giriş ekranı ayarları
/// sayfası deploy'dan sonra kimseye görünmez ve elle işaretlenmesi gerekir.
///
/// Yalnız HOST bağlamında çalışır: ayar host seviyesinde (Global provider) tutulduğu için
/// tenant'ta bir karşılığı yok. Bu aynı zamanda tenant oluşturma sırasındaki mükerrer-grant
/// tuzağından da korur — bkz. <see cref="PlatformTestDataSeedContributor"/> başındaki not
/// (aynı UoW içinde ikinci kez eklemek 23505 ihlaline yol açıyordu).
///
/// <see cref="IPermissionDataSeeder"/> var olan grant'ları eleyerek ekler, yani tekrar tekrar
/// çalıştırmak güvenlidir. Karşılığında: izin bilinçli olarak GERİ ALINIRSA sonraki DbMigrator
/// koşusunda geri gelir (ABP'de "hiç verilmemiş" ile "geri alınmış" ayırt edilemez).
/// </summary>
public class LoginScreenPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public LoginScreenPermissionDataSeedContributor(
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
            new[] { PlatformPermissions.LoginScreen.Default },
            context.TenantId);
    }
}
