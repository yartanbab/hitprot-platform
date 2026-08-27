using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SimpleStateChecking;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// SÖZLEŞME: görevi ekip dışına açma iznini KİRACI da kullanabilmeli.
///
/// <para><see cref="PlatformPermissions.Tasks.ShareExternally"/> hiçbir feature kapısının
/// arkasında DEĞİL (bkz. <c>PackageFeatureGates.Map</c>) — bu, #256'daki
/// <c>Projects.ManageCategories</c> ile birebir aynı durum ve aynı çifte boşluğu doğurur:</para>
///
/// <list type="number">
/// <item><b>Tavan:</b> izin <c>TenantPackageManager.LateAddedPermissions</c> listesinde
/// değilse kurulu sistemlerin paket satırlarına hiç girmez →
/// <c>PackagePermissionStateChecker</c> onu her kiracıda kapatır.</item>
/// <item><b>Grant:</b> contributor yalnız host admin rolüne verirse kiracıya hiç ulaşmaz;
/// kapısız izin <c>GrantNewlyEnabledPermissionsAsync</c> tarafından da hiçbir zaman "yeni
/// açılan modül" sayılmaz.</item>
/// </list>
///
/// <para>Biri kapanmadan diğeri işe yaramaz: grant varken tavan keser, tavan varken grant yok.
/// Bu yüzden ikisi ayrı ayrı ve bir de uçtan uca ölçülür.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskSharePermissionGap_Tests : PlatformEntityFrameworkCoreTestBase
{
    /// <summary>
    /// Rol izin sağlayıcısının adı. Sabitin sahibi <c>RolePermissionValueProvider</c> ayrı bir
    /// ABP paketinde yaşar ve bu test projesine referanslı değildir; değeri sözleşmenin parçası.
    /// </summary>
    private const string RoleProvider = "R";

    private const string Permission = PlatformPermissions.Tasks.ShareExternally;

    private readonly TenantPackageManager _packageManager;
    private readonly IPackageAppService _packageAppService;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionGrantRepository _permissionGrantRepository;
    private readonly IPermissionManager _permissionManager;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly ISimpleStateCheckerManager<PermissionDefinition> _stateCheckerManager;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly IRepository<TenantProfile, Guid> _profileRepository;
    private readonly IRepository<PlatformPackage, Guid> _packageRepository;
    private readonly IAsyncQueryableExecuter _asyncExecuter;
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly Apya.Platform.Tasks.TaskSharePermissionDataSeedContributor _shareSeeder;

    public TaskSharePermissionGap_Tests()
    {
        _packageManager = GetRequiredService<TenantPackageManager>();
        _packageAppService = GetRequiredService<IPackageAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _permissionGrantRepository = GetRequiredService<IPermissionGrantRepository>();
        _permissionManager = GetRequiredService<IPermissionManager>();
        _permissionDefinitionManager = GetRequiredService<IPermissionDefinitionManager>();
        _stateCheckerManager = GetRequiredService<ISimpleStateCheckerManager<PermissionDefinition>>();
        _roleRepository = GetRequiredService<IIdentityRoleRepository>();
        _profileRepository = GetRequiredService<IRepository<TenantProfile, Guid>>();
        _packageRepository = GetRequiredService<IRepository<PlatformPackage, Guid>>();
        _asyncExecuter = GetRequiredService<IAsyncQueryableExecuter>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _shareSeeder = GetRequiredService<Apya.Platform.Tasks.TaskSharePermissionDataSeedContributor>();
    }

    /// <summary>
    /// Bu özellikten ÖNCE kurulmuş bir kiracının birebir karşılığı: gerçek <c>Tenant</c> satırı,
    /// statik admin rolü, paket profili — ama paylaşım izni için grant YOK.
    /// </summary>
    private async Task<Guid> CreateLegacyTenantAsync(string name, PackageCode package)
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
                    new IdentityRole(Guid.NewGuid(), "admin", tenantId) { IsStatic = true, IsPublic = true },
                    autoSave: true);
            }
        });

        // Profilsiz kiracı Basic sayılır (PackageCeilingStore.GetPackageCodeAsync); gerçek
        // akıştaki gibi profil kurulmazsa tavan ölçümü yanıltıcı olur.
        await WithUnitOfWorkAsync(async () =>
        {
            var profile = new TenantProfile(Guid.NewGuid(), tenantId, CompanyType.Company, "1234567890", "a@b.com");
            profile.SetPackage(package);
            await _profileRepository.InsertAsync(profile, autoSave: true);
        });

        return tenantId;
    }

    /// <summary>
    /// Rolde grant KAYDI var mı — <c>IPermissionManager.GetForRoleAsync</c> değil: o, sonuca
    /// tavan/feature state checker'larını da karıştırır. Burada ölçülen yalnız "yazıldı mı".
    /// </summary>
    private Task<bool> IsGrantedForRoleAsync(Guid tenantId, string roleName, string permissionName)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await _permissionGrantRepository.FindAsync(permissionName, RoleProvider, roleName) != null;
            }
        });

    /// <summary>İzin, kiracı bağlamında paket tavanından GEÇİYOR mu (grant'tan bağımsız)?</summary>
    private Task<bool> IsPermissionEnabledForTenantAsync(Guid tenantId, string permissionName)
        => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var definition = await _permissionDefinitionManager.GetAsync(permissionName);
                return await _stateCheckerManager.IsEnabledAsync(definition);
            }
        });

    /// <summary>
    /// Paketin DB'de DURAN izin tavanı. Bilerek <c>IPackageAppService.GetPermissionsAsync</c>
    /// kullanılmaz: o metot okumadan önce <c>EnsureDefaultPackagesAsync</c> çağırır, yani
    /// tavanı okumaya çalışırken tamir de eder — ön koşul onunla ÖLÇÜLEMEZ.
    /// </summary>
    private Task<IReadOnlyList<string>> StoredCeilingAsync(PackageCode code)
        => WithUnitOfWorkAsync(async () =>
        {
            var queryable = await _packageRepository.WithDetailsAsync(p => p.Permissions);
            var pkg = await _asyncExecuter.FirstAsync(queryable.Where(p => p.Code == code));
            return pkg.ToPermissionNames();
        });

    /// <summary>Tavandan izni düşürerek "bu özellikten önceki paket satırı"nı taklit eder.</summary>
    private Task RemoveFromCeilingAsync(PackageCode code)
        => WithUnitOfWorkAsync(async () =>
        {
            var tree = await _packageAppService.GetPermissionsAsync(code);
            var kept = tree.Groups
                .SelectMany(g => g.Permissions)
                .Where(p => p.IsIncluded && p.Name != Permission)
                .Select(p => p.Name)
                .ToList();

            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = code,
                PermissionNames = kept
            });
        });

    /// <summary>
    /// Kurulu bir sistemin paket satırı bu özellikten ÖNCE tohumlandığı için paylaşım iznini
    /// içermez. Deploy tohumu bunu tamamlamalıdır; tamamlamazsa izin hiçbir kiracıda açılamaz
    /// ve yetki ekranında bile görünmez.
    /// </summary>
    [Fact]
    public async Task Deploy_Seed_Should_Backfill_The_Share_Permission_Into_An_Old_Package_Ceiling()
    {
        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());
        await RemoveFromCeilingAsync(PackageCode.Standard);

        (await StoredCeilingAsync(PackageCode.Standard))
            .ShouldNotContain(Permission, "ön koşul: izin tavandan çıkmış olmalı");

        // Deploy: DbMigrator paket tohumunu yeniden koşturur.
        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());

        (await StoredCeilingAsync(PackageCode.Standard)).ShouldContain(Permission);
    }

    /// <summary>
    /// Tavan tamiri yalnız listeye yazmakla bitmez: <c>PackageCeilingStore</c> önbelleği
    /// geçersizleştirilmezse izin kiracıda bir sonraki yeniden başlatmaya kadar KAPALI kalır.
    /// </summary>
    [Fact]
    public async Task Backfilled_Ceiling_Should_Take_Effect_For_The_Tenant_Without_Restart()
    {
        var tenantId = await CreateLegacyTenantAsync("paylasim-tavani", PackageCode.Standard);

        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());
        await RemoveFromCeilingAsync(PackageCode.Standard);

        (await IsPermissionEnabledForTenantAsync(tenantId, Permission))
            .ShouldBeFalse("ön koşul: tavan kesince izin kiracıda kapalı olmalı");

        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());

        (await IsPermissionEnabledForTenantAsync(tenantId, Permission)).ShouldBeTrue();
    }

    /// <summary>
    /// Asıl kullanıcı sözleşmesi: deploy'dan sonra MEVCUT bir kiracının admin rolü paylaşım
    /// iznini almış ve izin ETKİLİ olmalı (tavan + grant zinciri birlikte geçmeli).
    /// </summary>
    [Fact]
    public async Task Deploy_Seed_Should_Grant_The_Share_Permission_To_Existing_Tenants()
    {
        var tenantId = await CreateLegacyTenantAsync("eski-kiraci-paylasim", PackageCode.Standard);

        (await IsGrantedForRoleAsync(tenantId, "admin", Permission))
            .ShouldBeFalse("ön koşul: özellik öncesi kiracıda grant olmamalı");

        // Deploy tohumu — DbMigrator'ın HOST bağlamında koştuğu adım.
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            await _shareSeeder.SeedAsync(new DataSeedContext());
        });

        (await IsGrantedForRoleAsync(tenantId, "admin", Permission)).ShouldBeTrue();

        // Grant tek başına yetmez: paket tavanı da geçmeli, yoksa düğme yine çıkmaz.
        var effective = await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await _permissionManager.GetForRoleAsync("admin", Permission);
            }
        });
        effective.IsGranted.ShouldBeTrue();
    }

    /// <summary>
    /// Tohum idempotent olmalı: DbMigrator her deploy'da yeniden koşar ve mükerrer
    /// <c>(TenantId, Name, "R", "admin")</c> satırı <c>IX_AbpPermissionGrants</c> ihlaline
    /// (SqlServer 2627 / PostgreSql 23505) yol açardı.
    /// </summary>
    [Fact]
    public async Task Running_The_Deploy_Seed_Twice_Should_Not_Throw()
    {
        var tenantId = await CreateLegacyTenantAsync("iki-kez-paylasim", PackageCode.Premium);

        await WithUnitOfWorkAsync(() => _shareSeeder.SeedAsync(new DataSeedContext()));
        await Should.NotThrowAsync(
            () => WithUnitOfWorkAsync(() => _shareSeeder.SeedAsync(new DataSeedContext())));

        (await IsGrantedForRoleAsync(tenantId, "admin", Permission)).ShouldBeTrue();
    }

    /// <summary>
    /// 🔴 KİRACI BAĞLAMINDA HİÇBİR ŞEY YAPMAMALI. Yeni kiracı oluşturulurken ABP'nin kimlik
    /// tohumlayıcısı taze "admin" rolüne tüm Both-tarafı izinleri zaten verir; aynı UoW içinde
    /// ikinci kez vermek mükerrer grant üretip "Yeni Müşteri" ekranını 500'e düşürürdü.
    /// </summary>
    [Fact]
    public async Task Seeding_In_Tenant_Context_Should_Stay_A_No_Op()
    {
        var tenantId = await CreateLegacyTenantAsync("kiraci-baglami-paylasim", PackageCode.Standard);

        await WithUnitOfWorkAsync(() => _shareSeeder.SeedAsync(new DataSeedContext(tenantId)));

        (await IsGrantedForRoleAsync(tenantId, "admin", Permission)).ShouldBeFalse();
    }
}
