using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

public interface IFirmProfileAppService : IApplicationService
{
    Task<FirmProfileDto> GetMyProfileAsync();
    Task<FirmProfileDto> UpdateMyProfileAsync(UpdateFirmProfileDto input);
}
