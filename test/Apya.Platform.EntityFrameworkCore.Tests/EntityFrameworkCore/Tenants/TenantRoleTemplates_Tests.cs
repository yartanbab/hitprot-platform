using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// SEC-07 · Kiracı hazır rollerle başlar: Proje Sorumlusu, Muhasebe, Gözlemci (ürün kararı,
/// 2026-10-13). Roller eskiden yalnız demo tohumlamasında vardı.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TenantRoleTemplates_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string RoleProvider = "R";

    private readonly ITenantProfileAppService _tenantProfileAppService;
    private readonly TenantRoleTemplateSeeder _seeder;
    private readonly TenantRoleTemplateDataSeedContributor _backfill;
    private readonly TenantPackageManager _packageManager;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly IPermissionGrantRepository _grantRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ICurrentTenant _currentTenant;

    public TenantRoleTemplates_Tests()
    {
        _tenantProfileAppService = GetRequiredService<ITenantProfileAppService>();
        _seeder = GetRequiredService<TenantRoleTemplateSeeder>();
        _backfill = GetRequiredService<TenantRoleTemplateDataSeedContributor>();
        _packageManager = GetRequiredService<TenantPackageManager>();
        _roleRepository = GetRequiredService<IIdentityRoleRepository>();
        _grantRepository = GetRequiredService<IPermissionGrantRepository>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private Task<List<string>> RoleNamesAsync(Guid tenantId) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(tenantId))
        {
            return (await _roleRepository.GetListAsync()).Select(r => r.Name).ToList();
        }
    });

    private Task<List<string>> GrantsOfAsync(Guid tenantId, string roleName) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(tenantId))
        {
            return (await _grantRepository.GetListAsync(RoleProvider, roleName)).Select(g => g.Name).ToList();
        }
    });

    /// <summary>Bu özellikten ÖNCE kurulmuş kiracı: yalnız "admin" rolü var.</summary>
    private async Task<Guid> CreateLegacyTenantAsync(string name)
    {
        var tenantId = await WithUnitOfWorkAsync(async () =>
        {
            var tenant = await _tenantManager.CreateAsync(name);
            await _tenantRepository.InsertAsync(tenant, autoSave: true);
            return tenant.Id;
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await _roleRepository.InsertAsync(
                    new IdentityRole(Guid.NewGuid(), "admin", tenantId) { IsStatic = true, IsPublic = true }, autoSave: true);
            }
        });

        return tenantId;
    }

    [Fact]
    public async Task Yeni_kiraci_hazir_rollerle_kurulur()
    {
        var email = $"rol-{Guid.NewGuid():N}@test.local";
        var created = await _tenantProfileAppService.CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "rol-sablonu-" + Guid.NewGuid().ToString("N")[..8],
            AdminEmailAddress = email,
            AdminPassword = "1q2w3E*asd",
            PackageCode = PackageCode.Standard,
            CompanyType = CompanyType.Association,
            TaxNumber = Random.Shared.NextInt64(1_000_000_000, 9_999_999_999).ToString(),
            CorporateEmail = email,
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul"
        });

        var roles = await RoleNamesAsync(created.TenantId);

        roles.ShouldContain(TenantRoleTemplates.ProjectLead);
        roles.ShouldContain(TenantRoleTemplates.Accounting);
        roles.ShouldContain(TenantRoleTemplates.Observer);
        roles.ShouldContain("admin");
    }

    [Fact]
    public async Task Gozlemci_yalniz_gorur_hicbir_yazma_izni_almaz()
    {
        var tenantId = await CreateLegacyTenantAsync("rol-gozlemci-" + Guid.NewGuid().ToString("N")[..6]);
        await WithUnitOfWorkAsync(() => _seeder.EnsureAsync(tenantId));

        var grants = await GrantsOfAsync(tenantId, TenantRoleTemplates.Observer);

        grants.ShouldContain(PlatformPermissions.Projects.Default);
        grants.ShouldContain(PlatformPermissions.Projects.ViewBudget);
        grants.ShouldContain(PlatformPermissions.Expenses.Default);
        grants.ShouldContain(PlatformPermissions.Grants.Default);

        // Hiçbir oluşturma / düzenleme / silme / yönetme izni yok.
        grants.Where(g => g.EndsWith(".Create") || g.EndsWith(".Edit") || g.EndsWith(".Delete")).ShouldBeEmpty();
        grants.ShouldNotContain(PlatformPermissions.Grants.ManageApplications);
        grants.ShouldNotContain(PlatformPermissions.Projects.ManageBudget);
        grants.ShouldNotContain(PlatformPermissions.TenantSettings.Default);
    }

    [Fact]
    public async Task Muhasebe_finansi_yonetir_projeyi_yalniz_gorur()
    {
        var tenantId = await CreateLegacyTenantAsync("rol-muhasebe-" + Guid.NewGuid().ToString("N")[..6]);
        await WithUnitOfWorkAsync(() => _seeder.EnsureAsync(tenantId));

        var grants = await GrantsOfAsync(tenantId, TenantRoleTemplates.Accounting);

        grants.ShouldContain(PlatformPermissions.Expenses.Create);
        grants.ShouldContain(PlatformPermissions.Invoices.Create);
        grants.ShouldContain(PlatformPermissions.CashAccounts.Edit);
        grants.ShouldContain(PlatformPermissions.Projects.ViewBudget);
        grants.ShouldContain(PlatformPermissions.Projects.ManageBudget);

        grants.ShouldNotContain(PlatformPermissions.Projects.Edit);
        grants.ShouldNotContain(PlatformPermissions.Tasks.Create);
        grants.ShouldNotContain(PlatformPermissions.Grants.Default);
    }

    [Fact]
    public async Task Proje_sorumlusu_isi_yonetir_finansi_yalniz_gorur()
    {
        var tenantId = await CreateLegacyTenantAsync("rol-proje-" + Guid.NewGuid().ToString("N")[..6]);
        await WithUnitOfWorkAsync(() => _seeder.EnsureAsync(tenantId));

        var grants = await GrantsOfAsync(tenantId, TenantRoleTemplates.ProjectLead);

        grants.ShouldContain(PlatformPermissions.Projects.Edit);
        grants.ShouldContain(PlatformPermissions.Tasks.Create);
        grants.ShouldContain(PlatformPermissions.Documents.Create);
        grants.ShouldContain(PlatformPermissions.Grants.ManageApplications);
        grants.ShouldContain(PlatformPermissions.Expenses.Default);

        grants.ShouldNotContain(PlatformPermissions.Expenses.Create);
        grants.ShouldNotContain(PlatformPermissions.CashAccounts.Default);
        // Host'a özel izin kiracı rolüne yazılmaz.
        grants.ShouldNotContain(PlatformPermissions.Grants.Edit);
    }

    /// <summary>
    /// Var olana dokunulmaz: kiracının aynı adla kurduğu rol ve izinleri olduğu gibi kalır; ikinci
    /// çağrı yeni rol üretmez.
    /// </summary>
    [Fact]
    public async Task Ayni_adda_rol_varsa_atlanir_ve_izinleri_degismez()
    {
        var tenantId = await CreateLegacyTenantAsync("rol-var-" + Guid.NewGuid().ToString("N")[..6]);
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                await GetRequiredService<IdentityRoleManager>().CreateAsync(
                    new IdentityRole(Guid.NewGuid(), TenantRoleTemplates.Accounting, tenantId));
            }
        });

        var first = await WithUnitOfWorkAsync(() => _seeder.EnsureAsync(tenantId));
        var second = await WithUnitOfWorkAsync(() => _seeder.EnsureAsync(tenantId));

        first.ShouldBe(new[] { TenantRoleTemplates.ProjectLead, TenantRoleTemplates.Observer }, ignoreOrder: true);
        second.ShouldBeEmpty();
        (await GrantsOfAsync(tenantId, TenantRoleTemplates.Accounting)).ShouldBeEmpty("kiracının kendi rolüne izin yazılmaz");
    }

    /// <summary>Mevcut kiracılar rolleri yayında, BİR KEZ alır; silinen şablon rol geri gelmez.</summary>
    [Fact]
    public async Task Yayin_telafisi_mevcut_kiraciya_rolleri_bir_kez_ekler()
    {
        var tenantId = await CreateLegacyTenantAsync("rol-telafi-" + Guid.NewGuid().ToString("N")[..6]);
        await WithUnitOfWorkAsync(() => GetRequiredService<ISettingManager>().SetGlobalAsync(
            Apya.Platform.Settings.PlatformSettings.Backfills.TenantRoleTemplatesCreated, null));

        await WithUnitOfWorkAsync(() => _backfill.SeedAsync(new DataSeedContext()));
        (await RoleNamesAsync(tenantId)).ShouldContain(TenantRoleTemplates.Observer);

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var role = (await _roleRepository.GetListAsync()).Single(r => r.Name == TenantRoleTemplates.Observer);
                await _roleRepository.DeleteAsync(role, autoSave: true);
            }
        });

        await WithUnitOfWorkAsync(() => _backfill.SeedAsync(new DataSeedContext()));
        (await RoleNamesAsync(tenantId)).ShouldNotContain(TenantRoleTemplates.Observer);
    }
}
