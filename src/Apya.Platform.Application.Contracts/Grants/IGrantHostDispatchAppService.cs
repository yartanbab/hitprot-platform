using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>Host'un bir çağrıyı hedefli firmalara toplu göndermesi (B3).</summary>
public interface IGrantHostDispatchAppService : IApplicationService
{
    Task<List<HostRecommendationCandidateDto>> PreviewAsync(PreviewHostRecommendationInput input);

    Task SendAsync(SendHostRecommendationInput input);
}
