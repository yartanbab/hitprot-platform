using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.UsageLogs.Dtos;

public class AiUsageLogDto : EntityDto<Guid>
{
    public DateTime CreationTime { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public string RequestType { get; set; } = string.Empty;
    public AiRequestStatus Status { get; set; }
    public int TokensUsed { get; set; }
    public TimeSpan? Duration { get; set; }
    public double? DurationMs => Duration?.TotalMilliseconds;
    public string? ErrorMessage { get; set; }
}
