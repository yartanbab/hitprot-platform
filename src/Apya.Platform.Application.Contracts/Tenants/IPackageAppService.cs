using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

/// <summary>Faz 2: Host'un paket (edition) içeriklerini görüntülemesi/düzenlemesi.</summary>
public interface IPackageAppService : IApplicationService
{
    Task<List<PackageDto>> GetListAsync();

    Task UpdateFeaturesAsync(UpdatePackageFeaturesDto input);

    /// <summary>Paketin izin tavanını tam ağaç olarak döner (işaretli olanlar pakete dahil).</summary>
    Task<PackagePermissionTreeDto> GetPermissionsAsync(PackageCode code);

    /// <summary>Paketin izin tavanını değiştirir. Listede olmayan izin paketten çıkarılır.</summary>
    Task UpdatePermissionsAsync(UpdatePackagePermissionsDto input);

    /// <summary>Düzenlenen paketi, o pakete sahip mevcut tenant'lara yeniden uygular.</summary>
    Task<int> ReapplyToTenantsAsync(PackageCode code);
}
