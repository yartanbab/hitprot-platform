using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Tenants;

/// <summary>
/// Varsayılan paketleri ve izin tavanlarını tohumlar (host bağlamı; paketler host-side).
///
/// Neden seeder: izin tavanı boş olan paket "tavan yok" sayılır ve kısıt hiç işlemez.
/// Tohumlama yalnız paket yönetimi ekranı açıldığında yapılsaydı, deploy sonrası tavan
/// biri o sayfaya girene kadar uykuda kalırdı. <c>EnsureDefaultPackagesAsync</c> per-paket
/// idempotenttir; tekrar tekrar çalıştırmak güvenlidir.
/// </summary>
public class PackageDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly TenantPackageManager _packageManager;

    public PackageDataSeedContributor(TenantPackageManager packageManager)
    {
        _packageManager = packageManager;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        await _packageManager.EnsureDefaultPackagesAsync();
    }
}
