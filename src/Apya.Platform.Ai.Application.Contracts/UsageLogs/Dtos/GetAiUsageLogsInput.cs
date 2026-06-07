using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.UsageLogs.Dtos;

public class GetAiUsageLogsInput : PagedAndSortedResultRequestDto
{
    public string? ProviderName { get; set; }

    public AiRequestStatus? Status { get; set; }
}
