using System.Collections.Generic;
using System.Linq;
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

namespace Apya.Platform.DataTransfers;

/// <summary>
/// İçe/dışa aktarma izinlerini, bugün aktarım yapabilen rollere verir: bir modülü <b>görebilen</b>
/// rol dışa aktarmayı, modülde <b>içe aktarabilen</b> (kayıt açabilen) rol içe aktarmayı alır. Böylece
/// host "aktarım izinlerini uygula" anahtarını açtığında kimse o güne dek yapabildiği işi kaybetmez;
/// kısıtlama, rollerden izin kaldırılarak yapılır.
///
/// <para>🔴 BİR KEZ koşar (<see cref="PlatformSettings.Backfills.DataTransferPermissionsGranted"/>):
/// bir rolden bilerek kaldırılan izin sonraki yayında geri gelmemeli.</para>
///
/// <para>🔴 Yalnız HOST bağlamında koşar ve kiracıları kendisi dolaşır; kiracı bağlamında koşsaydı
/// yeni kiracı açılırken kimlik tohumlayıcısının verdiği izinle çakışıp mükerrer kayıt üretirdi.
/// Yeni kiracının yönetici rolü izinleri kimlik tohumlayıcısından alır; izinlerin paket tavanına
/// girmesini <c>TenantPackageManager.LateAddedPermissions</c> üstlenir.</para>
/// </summary>
public class DataTransferPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private static readonly string[] ExportGrants =
        { PlatformPermissions.DataTransfer.Default, PlatformPermissions.DataTransfer.Export, PlatformPermissions.DataTransfer.ManageTemplates };

    private static readonly string[] ImportGrants =
        { PlatformPermissions.DataTransfer.Default, PlatformPermissions.DataTransfer.Import, PlatformPermissions.DataTransfer.ManageTemplates };

    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IPermissionGrantRepository _grantRepository;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly ISettingManager _settingManager;

    public DataTransferPermissionDataSeedContributor(
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

        var done = await _settingManager.GetOrNullGlobalAsync(PlatformSettings.Backfills.DataTransferPermissionsGranted);
        if (done == "true")
        {
            return;
        }

        using (_currentTenant.Change(null))
        {
            await GrantInCurrentContextAsync(null, host: true);

            // Anahtarı çevirme izni yalnız host'un yönetici rolünde.
            var admin = await _roleRepository.FindByNormalizedNameAsync("ADMIN");
            if (admin != null)
            {
                await _permissionDataSeeder.SeedAsync(RolePermissionValueProvider.ProviderName, admin.Name,
                    new[] { PlatformPermissions.DataTransfer.ManageAccess }, null);
            }
        }

        foreach (var tenant in await _tenantRepository.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                await GrantInCurrentContextAsync(tenant.Id, host: false);
            }
        }

        await _settingManager.SetGlobalAsync(PlatformSettings.Backfills.DataTransferPermissionsGranted, "true");
    }

    /// <summary>Geçerli bağlamdaki (host ya da bir kiracı) her role, sahip olduğu modül izinlerine göre.</summary>
    private async Task GrantInCurrentContextAsync(System.Guid? tenantId, bool host)
    {
        var modules = DataTransferModules.All.Where(m => m.IsOn(host)).ToList();
        foreach (var role in await _roleRepository.GetListAsync())
        {
            var has = (await _grantRepository.GetListAsync(RolePermissionValueProvider.ProviderName, role.Name))
                .Select(g => g.Name).ToHashSet();

            var grants = new HashSet<string>();
            if (modules.Any(m => has.Contains(m.Permission)))
            {
                grants.UnionWith(ExportGrants);
            }

            if (modules.Any(m => m.ImportPermission != null && has.Contains(m.ImportPermission)))
            {
                grants.UnionWith(ImportGrants);
            }

            if (grants.Count > 0)
            {
                await _permissionDataSeeder.SeedAsync(
                    RolePermissionValueProvider.ProviderName, role.Name, grants, tenantId);
            }
        }
    }
}
