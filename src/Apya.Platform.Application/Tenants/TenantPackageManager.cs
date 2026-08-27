using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Features;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// Tenant'a paket (edition) uygular: paketin feature setini tenant'ın feature değerleri
/// olarak yazar (provider "T", key = tenantId). Faz 2: feature seti DB'deki
/// <see cref="PlatformPackage"/>'tan okunur; DB'de yoksa kod registry'sine (<see cref="PackageDefinitions"/>)
/// düşer. Varsayılan 4 paket <see cref="EnsureDefaultPackagesAsync"/> ile DB'ye tohumlanır.
/// </summary>
public class TenantPackageManager : ITransientDependency
{
    private readonly IFeatureManager _featureManager;
    private readonly IRepository<PlatformPackage, Guid> _packageRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IAsyncQueryableExecuter _asyncExecuter;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly PackageCeilingStore _ceilingStore;
    private readonly IFeatureChecker _featureChecker;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public TenantPackageManager(
        IFeatureManager featureManager,
        IRepository<PlatformPackage, Guid> packageRepository,
        IGuidGenerator guidGenerator,
        IAsyncQueryableExecuter asyncExecuter,
        IPermissionDefinitionManager permissionDefinitionManager,
        PackageCeilingStore ceilingStore,
        IFeatureChecker featureChecker,
        ICurrentTenant currentTenant,
        IPermissionDataSeeder permissionDataSeeder,
        IIdentityRoleRepository roleRepository)
    {
        _featureManager = featureManager;
        _packageRepository = packageRepository;
        _guidGenerator = guidGenerator;
        _asyncExecuter = asyncExecuter;
        _permissionDefinitionManager = permissionDefinitionManager;
        _ceilingStore = ceilingStore;
        _featureChecker = featureChecker;
        _currentTenant = currentTenant;
        _permissionDataSeeder = permissionDataSeeder;
        _roleRepository = roleRepository;
    }

    public async Task ApplyPackageAsync(Guid tenantId, PackageCode packageCode)
    {
        var values = await GetFeatureValuesAsync(packageCode);

        // Feature'lar YAZILMADAN ÖNCE ölç: bu paketle hangi modüller ilk kez açılıyor?
        var newlyEnabled = await GetNewlyEnabledFeaturesAsync(tenantId, values);

        foreach (var kv in values)
        {
            await _featureManager.SetAsync(
                kv.Key,
                kv.Value,
                TenantFeatureValueProvider.ProviderName,
                tenantId.ToString());
        }

        // Tenant'ın paketi değişmiş olabilir: izin tavanı önbelleği bayat kalmasın.
        await _ceilingStore.InvalidateTenantAsync(tenantId);

        await GrantNewlyEnabledPermissionsAsync(tenantId, newlyEnabled);
    }

    /// <summary>
    /// Paket uygulanmadan önce tenant'ta KAPALI olup bu paketle açılacak modül feature'ları.
    /// Yalnız izinle ifade edilebilenler (<see cref="PackageFeatureGates.Map"/>) sayılır;
    /// MaxUsers/MaxProjects gibi sayısal feature'ların izin karşılığı yoktur.
    /// </summary>
    private async Task<List<string>> GetNewlyEnabledFeaturesAsync(
        Guid tenantId,
        IReadOnlyDictionary<string, string> values)
    {
        var result = new List<string>();
        using (_currentTenant.Change(tenantId))
        {
            foreach (var kv in values)
            {
                if (kv.Value != "true" || !PackageFeatureGates.Map.ContainsKey(kv.Key)) { continue; }
                if (!await _featureChecker.IsEnabledAsync(kv.Key))
                {
                    result.Add(kv.Key);
                }
            }
        }
        return result;
    }

    /// <summary>
    /// Yeni açılan modüllerin izinlerini tenant'ın statik admin rolüne verir.
    ///
    /// <para>Neden gerekli: <see cref="IFeatureManager"/> yalnız feature değeri yazar, izin
    /// vermez. Bu adım olmadan paket yükseltilince modülün izin kutuları ekranda belirir ama
    /// BOŞ gelir — biri elle işaretleyip kaydedene kadar kenar çubuğunda hiçbir şey çıkmaz.</para>
    ///
    /// <para>Yalnız <em>yeni açılan</em> modüller işlenir: zaten açık modüllerde host'un
    /// bilinçli olarak kaldırdığı izinler paket her uygulandığında geri gelmez. Statik admin
    /// rolü olmayan tenant'ta (özel rol setiyle kurulmuş) sessizce atlanır; orada izinleri
    /// host, izin yönetimi ekranından dağıtır.</para>
    /// </summary>
    private async Task GrantNewlyEnabledPermissionsAsync(Guid tenantId, List<string> newlyEnabledFeatures)
    {
        if (!newlyEnabledFeatures.Any()) { return; }

        // Tenant tarafında tanımlı izinler — host-only olanlar (katalog yazma vb.) zaten dışarıda.
        var tenantPermissions = await GetTenantPermissionNamesAsync();
        var toGrant = tenantPermissions
            .Where(name => newlyEnabledFeatures.Any(f => PackageFeatureGates.IsGatedBy(f, name)))
            .Distinct()
            .ToList();

        if (!toGrant.Any()) { return; }

        using (_currentTenant.Change(tenantId))
        {
            var adminRole = (await _roleRepository.GetListAsync()).FirstOrDefault(r => r.IsStatic);
            if (adminRole == null) { return; }

            // IPermissionManager DEĞİL: o, izni yazmadan önce state checker'ları çalıştırır ve
            // feature değeri aynı UoW içinde henüz görünmediği için "izin devre dışı" diyerek
            // reddeder. Seeder doğrudan grant kaydı yazar ve mevcut olanları atlar (idempotent →
            // IX_AbpPermissionGrants üzerinde mükerrer kayıt üretmez).
            await _permissionDataSeeder.SeedAsync(
                RolePermissionValueProvider.ProviderName,
                adminRole.Name,
                toGrant,
                tenantId);
        }
    }

    /// <summary>
    /// Tenant tarafında tanımlı TÜM izin adları — paket izin tavanının evreni.
    /// Host'a özel izinler (MultiTenancySides.Host) dışarıda kalır: onlar zaten tenant'a
    /// görünmez, listeye yazmak yalnız gürültü olur.
    /// </summary>
    public async Task<List<string>> GetTenantPermissionNamesAsync()
    {
        var definitions = await _permissionDefinitionManager.GetPermissionsAsync();
        return definitions
            .Where(d => d.MultiTenancySide.HasFlag(MultiTenancySides.Tenant))
            .Select(d => d.Name)
            .ToList();
    }

    /// <summary>Paketin feature setini DB'den okur; DB'de tanım yoksa kod registry'sine düşer.</summary>
    private async Task<IReadOnlyDictionary<string, string>> GetFeatureValuesAsync(PackageCode code)
    {
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Features);
        var pkg = await _asyncExecuter.FirstOrDefaultAsync(queryable.Where(p => p.Code == code));
        if (pkg != null && pkg.Features.Any())
        {
            return pkg.ToFeatureValues();
        }
        return PackageDefinitions.For(code);
    }

    /// <summary>
    /// Eksik varsayılan paketleri registry'den DB'ye tohumlar (per-code idempotent → self-healing;
    /// yeni tier eklenince ya da bir paket silinince de tamamlar). Yönetim UI ilk açılışta çağırır.
    /// </summary>
    public async Task EnsureDefaultPackagesAsync()
    {
        // Features de yüklenir: aşağıdaki "sonradan eklenen feature" telafisi paketin
        // mevcut satırlarını görmeden hangisinin eksik olduğunu bilemez.
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Permissions, p => p.Features);
        var existing = await _asyncExecuter.ToListAsync(queryable);
        var existingCodes = existing.Select(p => p.Code).ToHashSet();

        var allPermissions = await GetTenantPermissionNamesAsync();

        var meta = new (PackageCode code, string name, string desc, int order)[]
        {
            (PackageCode.Basic, "Basic", "Temel paket — çekirdek finans + proje/görev.", 1),
            (PackageCode.Standard, "Standard", "Standart paket — hibe, doküman, takvim, çoklu döviz.", 2),
            (PackageCode.Premium, "Premium", "Gelişmiş paket — formlar, AI, gelişmiş raporlar.", 3),
            (PackageCode.Enterprise, "Enterprise", "Kurumsal paket — tüm modüller, yüksek limitler.", 4),
        };
        foreach (var m in meta)
        {
            if (existingCodes.Contains(m.code)) { continue; }

            var pkg = new PlatformPackage(_guidGenerator.Create(), m.code, m.name, m.desc, m.order);
            foreach (var kv in PackageDefinitions.For(m.code))
            {
                pkg.SetFeature(_guidGenerator.Create(), kv.Key, kv.Value);
            }
            pkg.ReplacePermissions(DefaultPermissionsFor(m.code, allPermissions));
            await _packageRepository.InsertAsync(pkg, autoSave: true);
        }

        // İzin tavanı bu özellikten ÖNCE var olan paketlere sonradan eklendi: listesi boş
        // kalan paket "tavan yok" demektir ve kısıt hiç işlemez. Boş olanları tohumla
        // (per-paket idempotent → self-healing, EnsureDefaultPackagesAsync'in mevcut ilkesi).
        foreach (var pkg in existing.Where(p => !p.Permissions.Any()))
        {
            pkg.ReplacePermissions(DefaultPermissionsFor(pkg.Code, allPermissions));
            await _packageRepository.UpdateAsync(pkg, autoSave: true);
            await _ceilingStore.InvalidatePackageAsync(pkg.Code);
        }

        await BackfillLateAdditionsAsync(existing.Where(p => p.Permissions.Any()));
    }

    /// <summary>
    /// Kod registry'sine SONRADAN eklenen feature ve izinleri, DB'de zaten var olan
    /// paketlere tamamlar.
    ///
    /// <para>Neden gerekli: paket satırları bir kez tohumlanır. Yeni bir capability feature'ı
    /// (ör. <see cref="PlatformFeatures.TaskQuickEntry"/>) eklendiğinde eski paketlerde o
    /// feature'ın SATIRI yoktur → <c>GetFeatureValuesAsync</c> DB'yi okuduğu için paket
    /// uygulanırken hiç yazılmaz ve tenant feature'ın <c>defaultValue</c>'suna ("true") düşer;
    /// Basic paket yeteneği sessizce AÇIK kalır. Aynı şekilde yeni izin adı eski paketlerin
    /// tavan listesinde olmadığı için <see cref="PackagePermissionStateChecker"/> onu her
    /// tenant'ta kapatır.</para>
    ///
    /// <para>Telafi bilerek DAR: yalnız <see cref="LateAddedPermissions"/> listesindeki adlar ve
    /// yalnız SATIRI HİÇ OLMAYAN feature'lar işlenir. Kör bir "eksikleri tamamla" taraması
    /// host'un ekrandan bilinçli olarak kaldırdığı izinleri de geri getirirdi.</para>
    /// </summary>
    private async Task BackfillLateAdditionsAsync(IEnumerable<PlatformPackage> packages)
    {
        foreach (var pkg in packages)
        {
            var changed = false;
            var registry = PackageDefinitions.For(pkg.Code);

            // 1) Satırı hiç olmayan feature'lar — var olan değerler EZİLMEZ.
            var haveFeatures = pkg.Features.Select(f => f.FeatureName).ToHashSet(StringComparer.Ordinal);
            foreach (var kv in registry.Where(kv => !haveFeatures.Contains(kv.Key)))
            {
                pkg.SetFeature(_guidGenerator.Create(), kv.Key, kv.Value);
                changed = true;
            }

            // 2) Sonradan tanımlanan izinler — paketin varsayılanı içeriyorsa tavana eklenir.
            var havePermissions = pkg.ToPermissionNames().ToHashSet(StringComparer.Ordinal);
            var missing = LateAddedPermissions
                .Where(name => !havePermissions.Contains(name)
                               && PackagePermissionDefaults.IsIncluded(pkg.Code, name))
                .ToList();
            if (missing.Any())
            {
                pkg.ReplacePermissions(
                    havePermissions.Concat(missing).Select(name => (_guidGenerator.Create(), name)));
                changed = true;
            }

            if (!changed) { continue; }

            await _packageRepository.UpdateAsync(pkg, autoSave: true);
            await _ceilingStore.InvalidatePackageAsync(pkg.Code);
        }
    }

    /// <summary>
    /// İlk paket tohumundan SONRA tanımlanan izinler. Sürüm sürüm büyür; bir ad buraya
    /// eklendiğinde <see cref="BackfillLateAdditionsAsync"/> onu mevcut paketlerin tavanına
    /// taşır. Buraya yazılmayan yeni izin, kurulu sistemlerde hiçbir tenant'ta açılamaz.
    /// </summary>
    private static readonly string[] LateAddedPermissions =
    {
        PlatformPermissions.Tasks.QuickCreate,
        PlatformPermissions.Tasks.ManagePlanning,
        // #256 ile geldi. Feature kapısı YOK → tavanı bu liste dışında dolduracak bir yol da
        // yok; buraya yazılmadığı sürece kurulu sistemlerde hiçbir kiracıda açılamıyordu.
        PlatformPermissions.Projects.ManageCategories,
        // Görev dış paylaşımı. ManageCategories ile aynı durum: feature kapısı yok →
        // GrantNewlyEnabledPermissionsAsync onu hiçbir zaman "yeni açılan modül" saymaz.
        PlatformPermissions.Tasks.ShareExternally,
    };

    private IEnumerable<(Guid Id, string Name)> DefaultPermissionsFor(
        PackageCode code,
        IEnumerable<string> allPermissionNames)
        => allPermissionNames
            .Where(name => PackagePermissionDefaults.IsIncluded(code, name))
            .Select(name => (_guidGenerator.Create(), name));
}
