using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

public interface IGrantRecommendationAppService : IApplicationService
{
    /// <summary>Yalnız firmaya önerilen (skor >= eşik ya da host-push) açık çağrılar.</summary>
    Task<List<GrantRecommendationDto>> GetMyRecommendationsAsync();

    /// <summary>Host'un yayınladığı TÜM açık çağrılar; öneri olanlar IsRecommended ile işaretli.</summary>
    Task<List<GrantRecommendationDto>> GetOpenCallsAsync();
}
