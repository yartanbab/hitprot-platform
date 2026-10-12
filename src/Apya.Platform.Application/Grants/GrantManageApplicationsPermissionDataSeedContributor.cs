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

namespace Apya.Platform.Grants;

/// <summary>
/// <see cref="PlatformPermissions.Grants.ManageApplications"/> iznini, kurulu kiracılarda
/// <b>hibeleri görebilen her role</b> verir (ürün kararı 2026-10-13, A yolu).
///
/// <para>Neden gerekli: firma tarafındaki hibe yazma uçları eskiden yalnız görüntüleme iznine
/// bakıyordu. Yeni izin şart koşulunca, telafi olmasaydı yayından sonra hiçbir firma kullanıcısı
/// ilgi bildiremez, başvuru gönderemezdi. Bugün hibeleri görebilen herkes zaten yazabiliyordu;
/// telafi o durumu aynen korur. Salt-okur kalması istenen rollerden izin SONRA kaldırılır.</para>
///
/// <para>🔴 BİR KEZ koşar (<see cref="PlatformSettings.Backfills.GrantManageApplicationsGranted"/>).
/// Her yayında yeniden koşsaydı, bir rolden bilerek kaldırılan izni geri getirirdi.</para>
///
/// <para>🔴 Yalnız HOST bağlamında koşar; kiracı bağlamındaki tohumlamada (yeni kiracı kurulurken)
/// çalışmaz — gerekçe için bkz. <see cref="Apya.Platform.Tasks.TaskSharePermissionDataSeedContributor"/>.
/// Yeni kiracının yönetici rolü tüm kiracı izinlerini kimlik tohumlayıcısından zaten alır.</para>
///
/// <para>İznin paket tavanına girmesini <c>TenantPackageManager.LateAddedPermissions</c> üstlenir;
/// tavan geçmezse bu grant tek başına etkisizdir.</para>
/// </summary>
public class GrantManageApplicationsPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private static readonly string[] Permissions = { PlatformPermissions.Grants.ManageApplications };

    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IPermissionGrantRepository _grantRepository;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly ISettingManager _settingManager;

    public GrantManageApplicationsPermissionDataSeedContributor(
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

        var done = await _settingManager.GetOrNullGlobalAsync(
            PlatformSettings.Backfills.GrantManageApplicationsGranted);
        if (done == "true")
        {
            return;
        }

        foreach (var tenant in await _tenantRepository.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                foreach (var role in await _roleRepository.GetListAsync())
                {
                    var canView = await _grantRepository.FindAsync(
                        PlatformPermissions.Grants.Default, RolePermissionValueProvider.ProviderName, role.Name);
                    if (canView == null)
                    {
                        continue;
                    }

                    await _permissionDataSeeder.SeedAsync(
                        RolePermissionValueProvider.ProviderName, role.Name, Permissions, tenant.Id);
                }
            }
        }

        await _settingManager.SetGlobalAsync(
            PlatformSettings.Backfills.GrantManageApplicationsGranted, "true");
    }
}
