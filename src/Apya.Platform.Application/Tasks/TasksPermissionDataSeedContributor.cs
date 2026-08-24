using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev oluşturma ekranının yeni alt izinlerini (<see cref="PlatformPermissions.Tasks.QuickCreate"/>,
/// <see cref="PlatformPermissions.Tasks.ManagePlanning"/>) HOST'un "admin" rolüne verir.
///
/// <para>Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken tohumlanır. Bu seeder olmadan, kurulu bir sistemde deploy'dan sonra hızlı giriş
/// satırı ve planlama alanları host yöneticisine hiç görünmez. Aynı desen ve aynı gerekçe:
/// <see cref="Apya.Platform.Documents.DocumentsPermissionDataSeedContributor"/>.</para>
///
/// <para>YALNIZ HOST bağlamında çalışır (<see cref="DataSeedContext.TenantId"/> == null). Kiracı
/// bağlamında ÇALIŞTIRILMAZ: yeni kiracı oluşturulurken ABP'nin kimlik tohumlayıcısı taze "admin"
/// rolüne tüm Both-tarafı izinleri zaten verir; aynı UoW içinde ikinci kez vermek mükerrer
/// (TenantId, Name, "R", "admin") satırı üretip <c>IX_AbpPermissionGrants</c> ihlaline
/// (PostgreSql 23505 / SqlServer 2627) ve "Yeni Müşteri" 500'üne yol açardı.</para>
///
/// <para>KİRACILAR için karşılığı bu sınıf değil, paket akışıdır:
/// <see cref="Apya.Platform.Tenants.TenantPackageManager"/> paket uygulanırken yeni açılan
/// feature'ların izinlerini kiracının statik admin rolüne verir; izin tavanına eklenmesini de
/// aynı sınıftaki <c>BackfillLateAdditionsAsync</c> üstlenir.</para>
/// </summary>
public class TasksPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public TasksPermissionDataSeedContributor(
        IPermissionDataSeeder permissionDataSeeder,
        IIdentityRoleRepository roleRepository)
    {
        _permissionDataSeeder = permissionDataSeeder;
        _roleRepository = roleRepository;
    }

    public async System.Threading.Tasks.Task SeedAsync(DataSeedContext context)
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
                PlatformPermissions.Tasks.QuickCreate,
                PlatformPermissions.Tasks.ManagePlanning
            },
            context.TenantId);
    }
}
