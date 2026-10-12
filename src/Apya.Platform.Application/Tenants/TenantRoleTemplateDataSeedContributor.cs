using System.Threading.Tasks;
using Apya.Platform.Settings;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// SEC-07 · Hazır rolleri KURULU kiracılara da ekler (ürün kararı 2026-10-13: "mevcut kiracılara
/// da ekle"). Yeni kiracı rolleri kurulumda alır (<see cref="TenantProvisioner"/>).
///
/// <para>🔴 BİR KEZ koşar (<see cref="PlatformSettings.Backfills.TenantRoleTemplatesCreated"/>).
/// Her yayında koşsaydı, kiracının bilerek sildiği bir şablon rolü geri gelirdi.</para>
///
/// <para>🔴 Yalnız HOST bağlamında koşar. Kiracı bağlamındaki tohumlama yeni kiracının kurulumudur;
/// orada roller <see cref="TenantProvisioner"/>'dan gelir.</para>
/// </summary>
public class TenantRoleTemplateDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly TenantRoleTemplateSeeder _seeder;
    private readonly ITenantRepository _tenantRepository;
    private readonly ISettingManager _settingManager;

    public TenantRoleTemplateDataSeedContributor(
        TenantRoleTemplateSeeder seeder,
        ITenantRepository tenantRepository,
        ISettingManager settingManager)
    {
        _seeder = seeder;
        _tenantRepository = tenantRepository;
        _settingManager = settingManager;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        var done = await _settingManager.GetOrNullGlobalAsync(PlatformSettings.Backfills.TenantRoleTemplatesCreated);
        if (done == "true")
        {
            return;
        }

        foreach (var tenant in await _tenantRepository.GetListAsync())
        {
            await _seeder.EnsureAsync(tenant.Id);
        }

        await _settingManager.SetGlobalAsync(PlatformSettings.Backfills.TenantRoleTemplatesCreated, "true");
    }
}
