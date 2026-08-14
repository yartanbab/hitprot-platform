using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tenants;

/// <summary>tenantId → paket kodu. Host tarafından da geçersizleştirilebilsin diye tenant-bağımsız.</summary>
[IgnoreMultiTenancy]
public class TenantPackageCacheItem
{
    public PackageCode Code { get; set; }
}

/// <summary>paket kodu → izin tavanı. Aynı paket tüm tenant'larda ortak, tenant-bağımsız cache.</summary>
[IgnoreMultiTenancy]
public class PackageCeilingCacheItem
{
    public string[] Permissions { get; set; } = Array.Empty<string>();
}

/// <summary>
/// Tenant'ın paket izin tavanını çözer ve önbellekler. Tavan her izin kontrolünde sorulduğu
/// için (bir menü render'ı ~40 izin bakar) DB'ye her seferinde gidilmez.
/// <para>Geçersizleştirme: paket izinleri güncellenince <see cref="InvalidatePackageAsync"/>,
/// tenant'a paket atanınca <see cref="InvalidateTenantAsync"/>.</para>
/// </summary>
public class PackageCeilingStore : ITransientDependency
{
    private readonly IRepository<PlatformPackage, Guid> _packageRepository;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly IDistributedCache<TenantPackageCacheItem, string> _tenantPackageCache;
    private readonly IDistributedCache<PackageCeilingCacheItem, string> _ceilingCache;
    private readonly IAsyncQueryableExecuter _asyncExecuter;

    public PackageCeilingStore(
        IRepository<PlatformPackage, Guid> packageRepository,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        IDistributedCache<TenantPackageCacheItem, string> tenantPackageCache,
        IDistributedCache<PackageCeilingCacheItem, string> ceilingCache,
        IAsyncQueryableExecuter asyncExecuter)
    {
        _packageRepository = packageRepository;
        _tenantProfileRepository = tenantProfileRepository;
        _tenantPackageCache = tenantPackageCache;
        _ceilingCache = ceilingCache;
        _asyncExecuter = asyncExecuter;
    }

    /// <summary>
    /// Tenant'ın izin tavanı. <c>null</c> = tavan YOK (kısıt uygulanmaz): paketin izin listesi
    /// hiç tohumlanmamış demektir. Bu bilinçli bir güvenlik supabı — yanlış yapılandırma
    /// bütün tenant'ı kilitlemesin. "Listede yok" ile "liste yok" farklı şeylerdir.
    /// </summary>
    public async Task<HashSet<string>?> GetCeilingOrNullAsync(Guid tenantId)
    {
        var code = await GetPackageCodeAsync(tenantId);

        var item = await _ceilingCache.GetOrAddAsync(
            code.ToString(),
            async () =>
            {
                var queryable = await _packageRepository.WithDetailsAsync(p => p.Permissions);
                var pkg = await _asyncExecuter.FirstOrDefaultAsync(queryable.Where(p => p.Code == code));
                return new PackageCeilingCacheItem
                {
                    Permissions = pkg?.ToPermissionNames().ToArray() ?? Array.Empty<string>()
                };
            });

        if (item == null || item.Permissions.Length == 0)
        {
            return null;
        }

        return item.Permissions.ToHashSet(StringComparer.Ordinal);
    }

    /// <summary>
    /// Tenant'ın paket kodu. Profil kaydı yoksa <see cref="TenantProfile"/> varsayılanı
    /// (<see cref="PackageCode.Basic"/>) geçerlidir — profilsiz tenant "sınırsız" sayılmaz.
    /// </summary>
    private async Task<PackageCode> GetPackageCodeAsync(Guid tenantId)
    {
        var item = await _tenantPackageCache.GetOrAddAsync(
            tenantId.ToString(),
            async () =>
            {
                var profile = await _tenantProfileRepository.FindAsync(p => p.TenantId == tenantId);
                return new TenantPackageCacheItem { Code = profile?.PackageCode ?? PackageCode.Basic };
            });

        return item?.Code ?? PackageCode.Basic;
    }

    public Task InvalidatePackageAsync(PackageCode code)
        => _ceilingCache.RemoveAsync(code.ToString());

    public Task InvalidateTenantAsync(Guid tenantId)
        => _tenantPackageCache.RemoveAsync(tenantId.ToString());
}
