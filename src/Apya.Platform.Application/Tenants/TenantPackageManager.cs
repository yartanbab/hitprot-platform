using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Guids;
using Volo.Abp.Linq;

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

    public TenantPackageManager(
        IFeatureManager featureManager,
        IRepository<PlatformPackage, Guid> packageRepository,
        IGuidGenerator guidGenerator,
        IAsyncQueryableExecuter asyncExecuter)
    {
        _featureManager = featureManager;
        _packageRepository = packageRepository;
        _guidGenerator = guidGenerator;
        _asyncExecuter = asyncExecuter;
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

    /// <summary>4 varsayılan paketi (yoksa) registry'den DB'ye tohumlar. Yönetim UI ilk açılışta çağırır.</summary>
    public async Task EnsureDefaultPackagesAsync()
    {
        if (await _packageRepository.GetCountAsync() > 0) { return; }

        var meta = new (PackageCode code, string name, string desc, int order)[]
        {
            (PackageCode.Basic, "Basic", "Temel paket — çekirdek finans + proje/görev.", 1),
            (PackageCode.Standard, "Standard", "Standart paket — hibe, doküman, takvim, çoklu döviz.", 2),
            (PackageCode.Premium, "Premium", "Gelişmiş paket — formlar, AI, gelişmiş raporlar.", 3),
            (PackageCode.Enterprise, "Enterprise", "Kurumsal paket — tüm modüller, yüksek limitler.", 4),
        };
        foreach (var m in meta)
        {
            var pkg = new PlatformPackage(_guidGenerator.Create(), m.code, m.name, m.desc, m.order);
            foreach (var kv in PackageDefinitions.For(m.code))
            {
                pkg.SetFeature(_guidGenerator.Create(), kv.Key, kv.Value);
            }
            await _packageRepository.InsertAsync(pkg, autoSave: true);
        }
    }
}
