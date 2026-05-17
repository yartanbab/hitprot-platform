using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.FxRevaluations;

public interface IFxRevaluationAppService : IApplicationService
{
    Task<PagedResultDto<FxRevaluationSnapshotDto>> GetListAsync(GetFxRevaluationsInput input);
    Task<FxRevaluationSnapshotDto> GetAsync(Guid id);
    Task<FxRevaluationSnapshotDto> RunAsync(RunFxRevaluationDto input);
    Task DeleteAsync(Guid id);
}
