using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-08 gösterge izinlerini kurulu kiracıların rollerine verir: <b>projeyi görebilen</b> her rol
/// göstergeleri görür, <b>projeyi düzenleyebilen</b> her rol göstergeleri yönetir. Telafi olmasaydı
/// yeni özellik, yetki ekranından elle açılana dek hiçbir kurulu kiracıda görünmezdi.
///
/// <para>🔴 BİR KEZ koşar (<see cref="PlatformSettings.Backfills.ProjectIndicatorPermissionsGranted"/>):
/// bir rolden bilerek kaldırılan izin sonraki yayında geri gelmemeli.</para>
///
/// <para>Host rolleri de kapsanır (ayrı işaret:
/// <see cref="PlatformSettings.Backfills.ProjectIndicatorHostPermissionsGranted"/>).</para>
///
/// <para>🔴 Yalnız HOST bağlamında koşar; yeni kiracının yönetici rolü tüm kiracı izinlerini kimlik
/// tohumlayıcısından, hazır roller <c>TenantRoleTemplates</c>'ten alır. İzinlerin paket tavanına
/// girmesini <c>TenantPackageManager.LateAddedPermissions</c> üstlenir.</para>
/// </summary>
public class ProjectIndicatorPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private static readonly (string Has, string Gets)[] Rules =
    {
        (PlatformPermissions.Projects.Default, PlatformPermissions.Projects.ViewIndicators),
        (PlatformPermissions.Projects.Edit, PlatformPermissions.Projects.ManageIndicators),
    };

    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IPermissionGrantRepository _grantRepository;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly ISettingManager _settingManager;

    public ProjectIndicatorPermissionDataSeedContributor(
        IPermissionDataSeeder permissionDataSeeder,
        IPermissionGrantRepository grantRepository,
        IIdentityRoleRepository roleRepository,
        ITenantRepository tenantRepository,
        ICurrentTenant currentTenant,
        ISettingManager settingManager)
    {
        _permissionDataSeeder = permissionDataSeeder;
        _grantRepository = grantRepository;
        _roleRepository = roleRepository;
        _tenantRepository = tenantRepository;
        _currentTenant = currentTenant;
        _settingManager = settingManager;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        // Host rolleri: izinler iki tarafta da tanımlı. İlk telafi yalnız kiracıları dolaşıyordu;
        // host'ta yönetici dışındaki roller (proje yöneticisi, çalışan…) göstergeleri göremiyordu.
        var hostDone = await _settingManager.GetOrNullGlobalAsync(
            PlatformSettings.Backfills.ProjectIndicatorHostPermissionsGranted);
        if (hostDone != "true")
        {
            using (_currentTenant.Change(null))
            {
                await GrantInCurrentContextAsync(null);
            }

            await _settingManager.SetGlobalAsync(
                PlatformSettings.Backfills.ProjectIndicatorHostPermissionsGranted, "true");
        }

        var done = await _settingManager.GetOrNullGlobalAsync(
            PlatformSettings.Backfills.ProjectIndicatorPermissionsGranted);
        if (done == "true")
        {
            return;
        }

        foreach (var tenant in await _tenantRepository.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                await GrantInCurrentContextAsync(tenant.Id);
            }
        }

        await _settingManager.SetGlobalAsync(
            PlatformSettings.Backfills.ProjectIndicatorPermissionsGranted, "true");
    }

    /// <summary>Geçerli bağlamdaki (host ya da bir kiracı) her role, sahip olduğu proje iznine göre.</summary>
    private async Task GrantInCurrentContextAsync(System.Guid? tenantId)
    {
        foreach (var role in await _roleRepository.GetListAsync())
        {
            foreach (var (has, gets) in Rules)
            {
                var grant = await _grantRepository.FindAsync(
                    has, RolePermissionValueProvider.ProviderName, role.Name);
                if (grant == null)
                {
                    continue;
                }

                await _permissionDataSeeder.SeedAsync(
                    RolePermissionValueProvider.ProviderName, role.Name, new[] { gets }, tenantId);
            }
        }
    }
}
