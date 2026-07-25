using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

public interface IGrantRecommendationAppService : IApplicationService
{
    Task<List<GrantRecommendationDto>> GetMyRecommendationsAsync();
}
