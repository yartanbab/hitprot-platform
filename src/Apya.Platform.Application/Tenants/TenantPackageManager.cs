using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Guids;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;

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

    public TenantPackageManager(
        IFeatureManager featureManager,
        IRepository<PlatformPackage, Guid> packageRepository,
        IGuidGenerator guidGenerator,
        IAsyncQueryableExecuter asyncExecuter,
        IPermissionDefinitionManager permissionDefinitionManager,
        PackageCeilingStore ceilingStore)
    {
        _featureManager = featureManager;
        _packageRepository = packageRepository;
        _guidGenerator = guidGenerator;
        _asyncExecuter = asyncExecuter;
        _permissionDefinitionManager = permissionDefinitionManager;
        _ceilingStore = ceilingStore;
    }

    public async Task ApplyPackageAsync(Guid tenantId, PackageCode packageCode)
    {
        var values = await GetFeatureValuesAsync(packageCode);
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
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Permissions);
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
    }

    private IEnumerable<(Guid Id, string Name)> DefaultPermissionsFor(
        PackageCode code,
        IEnumerable<string> allPermissionNames)
        => allPermissionNames
            .Where(name => PackagePermissionDefaults.IsIncluded(code, name))
            .Select(name => (_guidGenerator.Create(), name));
}
