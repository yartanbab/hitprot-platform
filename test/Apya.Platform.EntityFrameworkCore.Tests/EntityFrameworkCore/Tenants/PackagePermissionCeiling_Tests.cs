using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SimpleStateChecking;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tenants;

/// <summary>
/// PAKET İZİN TAVANI sözleşmesi: bir izin, tenant'ın paketinin listesinde yoksa devre dışıdır —
/// yetki ekranında görünmez, rolde verilse bile geçmez. Host bu tavandan muaftır.
/// <para>
/// Her test <c>WithUnitOfWorkAsync</c> ile sarmalanır: <c>WithDetailsAsync</c> ile alınan
/// IQueryable, UoW kapanınca DbContext'i ile birlikte düşer (TaskTemplate_Tests ile aynı gerekçe).
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PackagePermissionCeiling_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IPackageAppService _packageAppService;
    private readonly TenantPackageManager _packageManager;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly ISimpleStateCheckerManager<PermissionDefinition> _stateCheckerManager;

    public PackagePermissionCeiling_Tests()
    {
        _packageAppService = GetRequiredService<IPackageAppService>();
        _packageManager = GetRequiredService<TenantPackageManager>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _permissionDefinitionManager = GetRequiredService<IPermissionDefinitionManager>();
        _stateCheckerManager = GetRequiredService<ISimpleStateCheckerManager<PermissionDefinition>>();
    }

    private async Task<Guid> CreateTenantWithPackageAsync(PackageCode code)
    {
        var tenantId = Guid.NewGuid();
        var profile = new TenantProfile(Guid.NewGuid(), tenantId, CompanyType.Company, "1234567890", "a@b.com");
        profile.SetPackage(code);
        await _profileRepository.InsertAsync(profile, autoSave: true);
        return tenantId;
    }

    private async Task<bool> IsPermissionEnabledAsync(string permissionName)
    {
        var definition = await _permissionDefinitionManager.GetAsync(permissionName);
        return await _stateCheckerManager.IsEnabledAsync(definition);
    }

    [Fact]
    public async Task Default_Seed_Should_Mirror_The_Feature_Matrix()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();

            var basic = await _packageAppService.GetPermissionsAsync(PackageCode.Basic);
            var basicNodes = basic.Groups.SelectMany(g => g.Permissions).ToDictionary(p => p.Name, p => p.IsIncluded);

            // Basic'te kapalı modüller (paket feature matrisiyle birebir).
            basicNodes[PlatformPermissions.Grants.Default].ShouldBeFalse();
            basicNodes[PlatformPermissions.Grants.Create].ShouldBeFalse();
            basicNodes[PlatformPermissions.Documents.Default].ShouldBeFalse();
            basicNodes[PlatformPermissions.DynamicAssets.Default].ShouldBeFalse();
            basicNodes[PlatformPermissions.Calendars.Default].ShouldBeFalse();
            basicNodes[PlatformPermissions.TenantSettings.ManageAi].ShouldBeFalse();
            basicNodes[PlatformPermissions.Reports.TrialBalance].ShouldBeFalse();

            // Basic'te açık olanlar (Finance = true).
            basicNodes[PlatformPermissions.Incomes.Default].ShouldBeTrue();
            basicNodes[PlatformPermissions.CashAccounts.Default].ShouldBeTrue();
            basicNodes[PlatformPermissions.Projects.Default].ShouldBeTrue();
            basicNodes[PlatformPermissions.Tasks.Create].ShouldBeTrue();

            // Enterprise: tam ağaç — kilitli (host yönetimi) izinler hariç, onlar hiçbir
            // pakete giremez.
            var enterprise = await _packageAppService.GetPermissionsAsync(PackageCode.Enterprise);
            enterprise.Groups.SelectMany(g => g.Permissions)
                .Where(p => !p.IsHostOnly)
                .ShouldAllBe(p => p.IsIncluded);
        });
    }

    [Fact]
    public async Task Host_Only_Permissions_Should_Be_Listed_As_Locked()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();

            var tree = await _packageAppService.GetPermissionsAsync(PackageCode.Enterprise);
            var nodes = tree.Groups.SelectMany(g => g.Permissions).ToList();

            // Kiracı yönetimi izinleri ağaçta GÖRÜNÜR (yoklar sanılmasın) ama kilitlidir.
            var tenantManagement = nodes.SingleOrDefault(p => p.Name == TenantManagementPermissions.Tenants.Default);
            tenantManagement.ShouldNotBeNull();
            tenantManagement!.IsHostOnly.ShouldBeTrue();
            tenantManagement.IsIncluded.ShouldBeFalse();

            // Tenant tarafı izinler kilitli değil.
            nodes.Single(p => p.Name == PlatformPermissions.Projects.Default).IsHostOnly.ShouldBeFalse();
        });
    }

    [Fact]
    public async Task Saving_Should_Ignore_Host_Only_Permissions_Even_If_Sent()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();

            // İstemci kilidi aşsa (ya da API doğrudan çağrılsa) bile sunucu elemeli.
            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = PackageCode.Enterprise,
                PermissionNames = new List<string>
                {
                    PlatformPermissions.Projects.Default,
                    TenantManagementPermissions.Tenants.Default,
                    TenantManagementPermissions.Tenants.Delete
                }
            });
        });

        await WithUnitOfWorkAsync(async () =>
        {
            var tree = await _packageAppService.GetPermissionsAsync(PackageCode.Enterprise);
            var included = tree.Groups.SelectMany(g => g.Permissions).Where(p => p.IsIncluded).Select(p => p.Name).ToList();

            included.ShouldContain(PlatformPermissions.Projects.Default);
            included.ShouldNotContain(TenantManagementPermissions.Tenants.Default);
            included.ShouldNotContain(TenantManagementPermissions.Tenants.Delete);
        });
    }

    [Fact]
    public async Task Tenant_Should_Be_Limited_By_Its_Package()
    {
        var tenantId = Guid.Empty;
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            tenantId = await CreateTenantWithPackageAsync(PackageCode.Basic);
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                // Hibe, Basic'in tavanında değil.
                (await IsPermissionEnabledAsync(PlatformPermissions.Grants.Default)).ShouldBeFalse();
                // Proje/görev her pakette açık.
                (await IsPermissionEnabledAsync(PlatformPermissions.Projects.Default)).ShouldBeTrue();
                (await IsPermissionEnabledAsync(PlatformPermissions.Tasks.Default)).ShouldBeTrue();
            }
        });
    }

    [Fact]
    public async Task Host_Should_Be_Exempt_From_The_Ceiling()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();

            _currentTenant.Id.ShouldBeNull();
            (await IsPermissionEnabledAsync(PlatformPermissions.Grants.Default)).ShouldBeTrue();
            (await IsPermissionEnabledAsync(PlatformPermissions.DynamicAssets.Default)).ShouldBeTrue();
        });
    }

    [Fact]
    public async Task Editing_The_Ceiling_Should_Take_Effect_Without_Restart()
    {
        var tenantId = Guid.Empty;
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            tenantId = await CreateTenantWithPackageAsync(PackageCode.Premium);
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                (await IsPermissionEnabledAsync(PlatformPermissions.Documents.Default)).ShouldBeTrue();
            }
        });

        // Premium'dan doküman iznini çıkar (host işlemi).
        await WithUnitOfWorkAsync(async () =>
        {
            var tree = await _packageAppService.GetPermissionsAsync(PackageCode.Premium);
            var kept = tree.Groups
                .SelectMany(g => g.Permissions)
                .Select(p => p.Name)
                .Where(name => !name.StartsWith(PlatformPermissions.Documents.Default, StringComparison.Ordinal))
                .ToList();

            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = PackageCode.Premium,
                PermissionNames = kept
            });
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                // Önbellek geçersizleştirildiği için değişiklik anında görünür.
                (await IsPermissionEnabledAsync(PlatformPermissions.Documents.Default)).ShouldBeFalse();
                (await IsPermissionEnabledAsync(PlatformPermissions.Projects.Default)).ShouldBeTrue();
            }
        });
    }

    [Fact]
    public async Task Saving_The_Ceiling_Should_Derive_Module_Feature_Values()
    {
        var selected = new List<string>();

        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();

            // Standard'da AI izinleri kapalı → AiAssist "false" türetilmeli.
            var tree = await _packageAppService.GetPermissionsAsync(PackageCode.Standard);
            selected = tree.Groups.SelectMany(g => g.Permissions).Where(p => p.IsIncluded).Select(p => p.Name).ToList();

            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = PackageCode.Standard,
                PermissionNames = selected
            });
        });

        await WithUnitOfWorkAsync(async () =>
        {
            var standard = (await _packageAppService.GetListAsync()).Single(p => p.Code == PackageCode.Standard);
            standard.Features.Single(f => f.FeatureName == PlatformFeatures.AiAssist).Value.ShouldBe("false");
            standard.Features.Single(f => f.FeatureName == PlatformFeatures.Documents).Value.ShouldBe("true");
        });

        // AI ayar iznini ekle → AiAssist "true"ya döner (izin açık ama modül kapalı kalamaz).
        await WithUnitOfWorkAsync(async () =>
        {
            selected.Add(PlatformPermissions.TenantSettings.ManageAi);
            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = PackageCode.Standard,
                PermissionNames = selected
            });
        });

        await WithUnitOfWorkAsync(async () =>
        {
            var standard = (await _packageAppService.GetListAsync()).Single(p => p.Code == PackageCode.Standard);
            standard.Features.Single(f => f.FeatureName == PlatformFeatures.AiAssist).Value.ShouldBe("true");
        });
    }
}
