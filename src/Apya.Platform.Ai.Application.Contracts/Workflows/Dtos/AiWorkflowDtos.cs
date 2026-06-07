using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.Workflows.Dtos;

public class AiWorkflowRuleDto : EntityDto<Guid>
{
    public int Order { get; set; }
    public string JsonPath { get; set; } = null!;
    public RuleOperator Operator { get; set; }
    public string OperatorText => Operator.ToString();
    public string CompareValue { get; set; } = null!;
    public WorkflowActionType ActionType { get; set; }
    public string ActionTypeText => ActionType.ToString();
    public string? ActionPayload { get; set; }
}

public class AiWorkflowDto : EntityDto<Guid>
{
    public string Name { get; set; } = null!;
    public Guid? DocumentId { get; set; }
    public Guid? PromptId { get; set; }
    public bool IsActive { get; set; }
    public int RuleCount { get; set; }
}

public class AiWorkflowDetailDto : AiWorkflowDto
{
    public List<AiWorkflowRuleDto> Rules { get; set; } = new();
}

public class CreateUpdateAiWorkflowDto
{
    [Required]
    [StringLength(WorkflowConsts.MaxNameLength)]
    public string Name { get; set; } = null!;

    public Guid? DocumentId { get; set; }
    public Guid? PromptId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateWorkflowRuleDto
{
    [Required]
    [StringLength(WorkflowConsts.MaxJsonPathLength)]
    public string JsonPath { get; set; } = null!;

    public RuleOperator Operator { get; set; }

    [Required]
    [StringLength(WorkflowConsts.MaxCompareValueLength)]
    public string CompareValue { get; set; } = null!;

    public WorkflowActionType ActionType { get; set; }

    public string? ActionPayload { get; set; }
}
