using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Projects;

/// <summary>
/// <see cref="PlatformPermissions.Projects.ManageCategories"/> iznini host'un "admin"
/// rolüne verir.
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken seed edilir. Bu seeder olmadan kurulu bir sistemde Ayarlar > Projeler
/// altındaki kategori bölümü deploy'dan sonra kimseye görünmez.
///
/// Yalnız HOST bağlamında çalışır: kiracı bağlamında koşan özel seeder'lar ABP'nin taze
/// admin'e verdiği izinlerle çakışıp unique index hatası (2627/23505) üretiyor.
/// <see cref="IPermissionDataSeeder"/> var olan grant'ları eleyerek ekler → idempotent.
/// </summary>
public class ProjectCategoryPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public ProjectCategoryPermissionDataSeedContributor(
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
            new[] { PlatformPermissions.Projects.ManageCategories },
            context.TenantId);
    }
}
