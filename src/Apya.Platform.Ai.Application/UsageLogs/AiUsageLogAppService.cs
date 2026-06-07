using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.UsageLogs.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.UsageLogs;

/// <summary>
/// Read-only reporting over the existing <see cref="AiRequest"/> aggregate
/// (no new table — R: reuse existing usage persistence).
/// </summary>
[Authorize(AiPermissions.UsageLogs.View)]
public class AiUsageLogAppService : ApplicationService, IAiUsageLogAppService
{
    private readonly IAiRequestRepository _aiRequestRepository;

    public AiUsageLogAppService(IAiRequestRepository aiRequestRepository)
    {
        _aiRequestRepository = aiRequestRepository;
    }

    public async Task<PagedResultDto<AiUsageLogDto>> GetListAsync(GetAiUsageLogsInput input)
    {
        var queryable = await _aiRequestRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(input.ProviderName))
        {
            var provider = input.ProviderName.Trim();
            queryable = queryable.Where(x => x.ProviderName == provider);
        }

        if (input.Status.HasValue)
        {
            var status = input.Status.Value;
            queryable = queryable.Where(x => x.Status == status);
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var items = await AsyncExecuter.ToListAsync(
            queryable
                .OrderByDescending(x => x.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .Select(x => new AiUsageLogDto
                {
                    Id = x.Id,
                    CreationTime = x.CreationTime,
                    ProviderName = x.ProviderName,
                    RequestType = x.RequestType,
                    Status = x.Status,
                    TokensUsed = x.TokensUsed,
                    Duration = x.Duration,
                    ErrorMessage = x.ErrorMessage
                }));

        return new PagedResultDto<AiUsageLogDto>(totalCount, items);
    }
}
