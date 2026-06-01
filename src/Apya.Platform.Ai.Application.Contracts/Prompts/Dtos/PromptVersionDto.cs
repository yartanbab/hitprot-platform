using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.Prompts.Dtos;

public class PromptVersionDto : EntityDto<Guid>
{
    public Guid PromptId { get; set; }
    public int VersionNo { get; set; }
    public string SystemPrompt { get; set; } = string.Empty;
    public string UserPromptTemplate { get; set; } = string.Empty;
    public string? JsonSchema { get; set; }
    public string? ExpectedOutputSample { get; set; }
    public PromptVersionStatus Status { get; set; }
    public DateTime? PublishedAt { get; set; }
}
