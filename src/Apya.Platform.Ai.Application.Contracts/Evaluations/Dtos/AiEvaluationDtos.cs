using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.Evaluations.Dtos;

public class AiEvaluationDto : EntityDto<Guid>
{
    public Guid DocumentId { get; set; }
    public Guid ResponseId { get; set; }
    public Guid PromptId { get; set; }
    public Guid PromptVersionId { get; set; }
    public AiEvaluationStatus Status { get; set; }
    public string StatusText => Status.ToString();
    public bool? IsSchemaValid { get; set; }
    public int? Score { get; set; }
    public string? RiskLevel { get; set; }
    public string? Decision { get; set; }
    public DateTime CreationTime { get; set; }
}

public class AiEvaluationDetailDto : AiEvaluationDto
{
    public string? RawJson { get; set; }
    public string? Summary { get; set; }
    public int? TokensUsed { get; set; }
    public int? DurationMs { get; set; }
    public string? ErrorMessage { get; set; }
    public Guid? AiRequestId { get; set; }
}

public class GetEvaluationsInput : PagedAndSortedResultRequestDto
{
    public Guid? DocumentId { get; set; }
    public AiEvaluationStatus? Status { get; set; }
}
