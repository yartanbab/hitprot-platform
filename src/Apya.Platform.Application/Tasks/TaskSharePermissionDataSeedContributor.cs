using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Tasks;

/// <summary>
/// <see cref="PlatformPermissions.Tasks.ShareExternally"/> iznini host'un ve KURULU
/// kiracıların "admin" rolüne verir.
///
/// <para>Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken tohumlanır. Bu seeder olmadan kurulu bir sistemde görev detayındaki
/// "Dışarıyla paylaş" düğmesi deploy'dan sonra kimseye görünmez.</para>
///
/// <para><b>Kiracı telafisi neden BURADA:</b> normalde kiracıların yeni izinleri paket akışından
/// gelir (<c>TenantPackageManager.GrantNewlyEnabledPermissionsAsync</c>), ama o yol yalnız bir
/// modül feature'ı <c>false→true</c> olduğunda çalışır. Dış paylaşım izni hiçbir feature kapısının
/// arkasında DEĞİL (<c>PackageFeatureGates.Map</c>) → hiçbir zaman "yeni açılan modül" sayılmaz,
/// dolayısıyla mevcut kiracılara asla ulaşmazdı. İzin tavanına girmesini ise
/// <c>TenantPackageManager.LateAddedPermissions</c> üstlenir; ikisi birlikte gerekir — tavan
/// geçmezse grant tek başına etkisizdir. Emsal: #277 /
/// <see cref="Apya.Platform.Projects.ProjectCategoryPermissionDataSeedContributor"/>.</para>
///
/// <para>🔴 Kiracı döngüsü YALNIZ HOST bağlamında koşar. Kiracı bağlamında
/// (<see cref="DataSeedContext.TenantId"/> != null) çalıştırılmaz: yeni kiracı oluşturulurken
/// ABP'nin kimlik tohumlayıcısı taze "admin" rolüne tüm Both-tarafı izinleri zaten verir; aynı
/// UoW içinde ikinci kez vermek mükerrer (TenantId, Name, "R", "admin") satırı üretip
/// <c>IX_AbpPermissionGrants</c> ihlaline (SqlServer 2627 / PostgreSql 23505) ve "Yeni Müşteri"
/// 500'üne yol açardı. Host bağlamındaki döngü o UoW'un dışındadır;
/// <see cref="IPermissionDataSeeder"/> var olan grant'ları eleyerek eklediği için tekrar tekrar
/// koşması güvenlidir (idempotent).</para>
/// </summary>
public class TaskSharePermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private static readonly string[] Permissions = { PlatformPermissions.Tasks.ShareExternally };

    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskSharePermissionDataSeedContributor(
        IPermissionDataSeeder permissionDataSeeder,
        IIdentityRoleRepository roleRepository,
        ITenantRepository tenantRepository,
        ICurrentTenant currentTenant)
    {
        _permissionDataSeeder = permissionDataSeeder;
        _roleRepository = roleRepository;
        _tenantRepository = tenantRepository;
        _currentTenant = currentTenant;
    }

    public async System.Threading.Tasks.Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        var hostAdminRole = await _roleRepository.FindByNormalizedNameAsync("ADMIN");
        if (hostAdminRole != null)
        {
            await _permissionDataSeeder.SeedAsync(
                RolePermissionValueProvider.ProviderName,
                hostAdminRole.Name,
                Permissions,
                tenantId: null);
        }

        foreach (var tenant in await _tenantRepository.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                // Statik admin rolü olmayan kiracı (özel rol setiyle kurulmuş) sessizce
                // atlanır; orada izinleri host, yetki yönetimi ekranından dağıtır.
                var adminRole = (await _roleRepository.GetListAsync()).FirstOrDefault(r => r.IsStatic);
                if (adminRole == null)
                {
                    continue;
                }

                await _permissionDataSeeder.SeedAsync(
                    RolePermissionValueProvider.ProviderName,
                    adminRole.Name,
                    Permissions,
                    tenant.Id);
            }
        }
    }
}
