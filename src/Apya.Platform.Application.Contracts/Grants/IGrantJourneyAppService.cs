using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>18d · Kiracı · Hibe Yolculuğum. Yalnız kiracı bağlamında çalışır.</summary>
public interface IGrantJourneyAppService : IApplicationService
{
    Task<GrantJourneyDto> GetAsync();
}
