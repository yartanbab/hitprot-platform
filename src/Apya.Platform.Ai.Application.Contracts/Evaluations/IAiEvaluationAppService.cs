using System;
using System.Threading.Tasks;
using Apya.Platform.Ai.Evaluations.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Evaluations;

public interface IAiEvaluationAppService : IApplicationService
{
    Task<PagedResultDto<AiEvaluationDto>> GetListAsync(GetEvaluationsInput input);

    Task<AiEvaluationDetailDto> GetAsync(Guid id);

    /// <summary>Re-queues a failed evaluation for processing.</summary>
    Task RetryAsync(Guid id);
}
