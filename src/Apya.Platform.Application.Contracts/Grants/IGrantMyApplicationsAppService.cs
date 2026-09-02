using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 6a · Kiracı · Başvurularım. Firmanın kendi başvuruları; host tarafındaki pano
/// 2c'dir.
/// </summary>
public interface IGrantMyApplicationsAppService : IApplicationService
{
    Task<GrantMyApplicationsDto> GetAsync();
}
