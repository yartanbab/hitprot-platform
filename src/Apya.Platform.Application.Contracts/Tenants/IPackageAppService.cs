using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

/// <summary>Faz 2: Host'un paket (edition) içeriklerini görüntülemesi/düzenlemesi.</summary>
public interface IPackageAppService : IApplicationService
{
    Task<List<PackageDto>> GetListAsync();

    Task UpdateFeaturesAsync(UpdatePackageFeaturesDto input);

    /// <summary>Düzenlenen paketi, o pakete sahip mevcut tenant'lara yeniden uygular.</summary>
    Task<int> ReapplyToTenantsAsync(PackageCode code);
}
