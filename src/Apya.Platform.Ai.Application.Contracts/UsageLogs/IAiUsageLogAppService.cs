using System.Threading.Tasks;
using Apya.Platform.Ai.UsageLogs.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.UsageLogs;

public interface IAiUsageLogAppService : IApplicationService
{
    Task<PagedResultDto<AiUsageLogDto>> GetListAsync(GetAiUsageLogsInput input);
}
