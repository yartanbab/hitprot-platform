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

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// SÖZLEŞME: proje kategorisi tanımlarını KİRACI da yönetebilmeli.
///
/// <para>Regresyon kaynağı (#256 ile geldi, 2026-08-27'de canlıda yakalandı): iki ayrı boşluk
/// üst üste binince <see cref="PlatformPermissions.Projects.ManageCategories"/> kiracıda
/// hiçbir şekilde açılamıyordu — ne otomatik verilir ne de yetki ekranından işaretlenebilirdi.</para>
///
/// <list type="number">
/// <item><b>Tavan:</b> izin <c>TenantPackageManager.LateAddedPermissions</c> listesinde yoktu →
/// kurulu sistemlerin paket satırlarına hiç girmedi → <c>PackagePermissionStateChecker</c> onu
/// her kiracıda kapattı ("listede yok").</item>
/// <item><b>Grant:</b> izni tohumlayan contributor yalnız HOST admin rolüne veriyordu. Kiracı
/// karşılığı olan paket akışı da işe yaramaz, çünkü bu izin bir feature kapısının arkasında
/// DEĞİL — dolayısıyla hiçbir zaman "yeni açılan modül" sayılmaz.</item>
/// </list>
///
/// <para>Menünün/bölümün çıkması için üç şart birden gerekir: feature (burada yok), paket
/// tavanı, role verilmiş grant. Bu yüzden testler ikisini ayrı ayrı ve bir de uçtan uca ölçer.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectCategoryPermissionGap_Tests : PlatformEntityFrameworkCoreTestBase
{
    /// <summary>
    /// Rol izin sağlayıcısının adı. Sabitin sahibi <c>RolePermissionValueProvider</c> ayrı bir
    /// ABP paketinde yaşar ve bu test projesine referanslı değildir; değeri sözleşmenin parçası.
    /// </summary>
    private const string RoleProvider = "R";

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
    private readonly Apya.Platform.Projects.ProjectCategoryPermissionDataSeedContributor _categorySeeder;

    public ProjectCategoryPermissionGap_Tests()
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
        _categorySeeder = GetRequiredService<Apya.Platform.Projects.ProjectCategoryPermissionDataSeedContributor>();
    }

    /// <summary>
    /// #256 ÖNCESİ kurulmuş bir kiracının birebir karşılığı: gerçek <c>Tenant</c> satırı,
    /// statik admin rolü, paket profili — ama kategori izni için grant YOK.
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
    /// tavanı okumaya çalışırken tamir de eder — "izin tavandan çıktı" ön koşulu onunla
    /// ÖLÇÜLEMEZ.
    /// </summary>
    private Task<IReadOnlyList<string>> StoredCeilingAsync(PackageCode code)
        => WithUnitOfWorkAsync(async () =>
        {
            var queryable = await _packageRepository.WithDetailsAsync(p => p.Permissions);
            var pkg = await _asyncExecuter.FirstAsync(queryable.Where(p => p.Code == code));
            return pkg.ToPermissionNames();
        });

    /// <summary>
    /// Kurulu bir sistemin paket satırı #256'dan ÖNCE tohumlandığı için kategori iznini
    /// içermez. Deploy tohumu (<c>EnsureDefaultPackagesAsync</c>) bunu tamamlamalıdır;
    /// tamamlamazsa izin hiçbir kiracıda açılamaz ve yetki ekranında bile görünmez.
    /// </summary>
    [Fact]
    public async Task Deploy_Seed_Should_Backfill_The_Category_Permission_Into_An_Old_Package_Ceiling()
    {
        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());

        // "#256 öncesi paket satırı" simülasyonu: izni tavandan çıkar.
        await WithUnitOfWorkAsync(async () =>
        {
            var tree = await _packageAppService.GetPermissionsAsync(PackageCode.Standard);
            var kept = tree.Groups
                .SelectMany(g => g.Permissions)
                .Where(p => p.IsIncluded && p.Name != PlatformPermissions.Projects.ManageCategories)
                .Select(p => p.Name)
                .ToList();

            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = PackageCode.Standard,
                PermissionNames = kept
            });
        });

        (await StoredCeilingAsync(PackageCode.Standard))
            .ShouldNotContain(PlatformPermissions.Projects.ManageCategories, "ön koşul: izin tavandan çıkmış olmalı");

        // Deploy: DbMigrator paket tohumunu yeniden koşturur.
        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());

        (await StoredCeilingAsync(PackageCode.Standard))
            .ShouldContain(PlatformPermissions.Projects.ManageCategories);
    }

    /// <summary>
    /// Tavan tamiri yalnız listeye yazmakla bitmez: <c>PackageCeilingStore</c> önbelleği
    /// geçersizleştirilmezse izin kiracıda bir sonraki yeniden başlatmaya kadar KAPALI kalır.
    /// Bu yüzden ölçüm, kiracı bağlamında state checker üzerinden yapılır.
    /// </summary>
    [Fact]
    public async Task Backfilled_Ceiling_Should_Take_Effect_For_The_Tenant_Without_Restart()
    {
        var tenantId = await CreateLegacyTenantAsync("tavan-tamiri", PackageCode.Standard);

        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());

        // "#256 öncesi paket satırı" simülasyonu + önbelleğin bayat kalmaması için aynı yol.
        await WithUnitOfWorkAsync(async () =>
        {
            var tree = await _packageAppService.GetPermissionsAsync(PackageCode.Standard);
            var kept = tree.Groups
                .SelectMany(g => g.Permissions)
                .Where(p => p.IsIncluded && p.Name != PlatformPermissions.Projects.ManageCategories)
                .Select(p => p.Name)
                .ToList();

            await _packageAppService.UpdatePermissionsAsync(new UpdatePackagePermissionsDto
            {
                Code = PackageCode.Standard,
                PermissionNames = kept
            });
        });

        (await IsPermissionEnabledForTenantAsync(tenantId, PlatformPermissions.Projects.ManageCategories))
            .ShouldBeFalse("ön koşul: tavan kesince izin kiracıda kapalı olmalı");

        await WithUnitOfWorkAsync(() => _packageManager.EnsureDefaultPackagesAsync());

        (await IsPermissionEnabledForTenantAsync(tenantId, PlatformPermissions.Projects.ManageCategories))
            .ShouldBeTrue();
    }

    /// <summary>
    /// Asıl kullanıcı sözleşmesi: deploy'dan sonra MEVCUT bir kiracının admin rolü kategori
    /// iznini almış olmalı ve izin ETKİLİ olmalı (tavan + grant zinciri birlikte geçmeli).
    /// </summary>
    [Fact]
    public async Task Deploy_Seed_Should_Grant_The_Category_Permission_To_Existing_Tenants()
    {
        var tenantId = await CreateLegacyTenantAsync("eski-kiraci", PackageCode.Standard);

        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Projects.ManageCategories))
            .ShouldBeFalse("ön koşul: #256 öncesi kiracıda grant olmamalı");

        // Deploy tohumu — DbMigrator'ın HOST bağlamında koştuğu adım.
        await WithUnitOfWorkAsync(async () =>
        {
            await _packageManager.EnsureDefaultPackagesAsync();
            await _categorySeeder.SeedAsync(new DataSeedContext());
        });

        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Projects.ManageCategories))
            .ShouldBeTrue();

        // Grant tek başına yetmez: paket tavanı da geçmeli, yoksa Ayarlar'daki kategori
        // bölümü yine çıkmaz.
        var effective = await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await _permissionManager.GetForRoleAsync(
                    "admin", PlatformPermissions.Projects.ManageCategories);
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
        var tenantId = await CreateLegacyTenantAsync("iki-kez", PackageCode.Premium);

        await WithUnitOfWorkAsync(() => _categorySeeder.SeedAsync(new DataSeedContext()));
        await Should.NotThrowAsync(
            () => WithUnitOfWorkAsync(() => _categorySeeder.SeedAsync(new DataSeedContext())));

        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Projects.ManageCategories))
            .ShouldBeTrue();
    }

    /// <summary>
    /// 🔴 KİRACI BAĞLAMINDA HİÇBİR ŞEY YAPMAMALI. Yeni kiracı oluşturulurken ABP'nin kimlik
    /// tohumlayıcısı taze "admin" rolüne tüm Both-tarafı izinleri zaten verir; aynı UoW içinde
    /// ikinci kez vermek mükerrer grant üretip "Yeni Müşteri" ekranını 500'e düşürürdü
    /// (2026-08-22'de canlıda yaşandı, PR #213 ile kapatıldı).
    /// </summary>
    [Fact]
    public async Task Seeding_In_Tenant_Context_Should_Stay_A_No_Op()
    {
        var tenantId = await CreateLegacyTenantAsync("kiraci-baglami", PackageCode.Standard);

        await WithUnitOfWorkAsync(() => _categorySeeder.SeedAsync(new DataSeedContext(tenantId)));

        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Projects.ManageCategories))
            .ShouldBeFalse();
    }

    /// <summary>
    /// Statik admin rolü olmayan kiracı (özel rol setiyle kurulmuş) sessizce atlanır —
    /// tohum patlamaz, izni host yetki ekranından dağıtır.
    /// </summary>
    [Fact]
    public async Task Tenant_Without_A_Static_Admin_Role_Should_Not_Break_The_Seed()
    {
        var tenantId = await CreateLegacyTenantAsync("statiksiz", PackageCode.Standard);

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var role = await _roleRepository.FindByNormalizedNameAsync("ADMIN");
                role!.IsStatic = false;
                await _roleRepository.UpdateAsync(role, autoSave: true);
            }
        });

        await Should.NotThrowAsync(
            () => WithUnitOfWorkAsync(() => _categorySeeder.SeedAsync(new DataSeedContext())));

        (await IsGrantedForRoleAsync(tenantId, "admin", PlatformPermissions.Projects.ManageCategories))
            .ShouldBeFalse();
    }
}
