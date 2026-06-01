using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Ai.Workflows;

/// <summary>
/// A single "condition → action" rule of an <see cref="AiWorkflow"/> (child entity).
/// The condition tests a field (<see cref="JsonPath"/>, a top-level property of the AI result JSON,
/// e.g. "score" or "$.riskLevel") with an <see cref="RuleOperator"/> against <see cref="CompareValue"/>.
/// When it matches, <see cref="ActionType"/> (+ optional <see cref="ActionPayload"/>) is dispatched.
/// </summary>
public class AiWorkflowRule : Entity<Guid>
{
    public Guid WorkflowId { get; private set; }
    public int Order { get; private set; }
    public string JsonPath { get; private set; } = null!;
    public RuleOperator Operator { get; private set; }
    public string CompareValue { get; private set; } = null!;
    public WorkflowActionType ActionType { get; private set; }
    public string? ActionPayload { get; private set; }

    protected AiWorkflowRule() { }

    internal AiWorkflowRule(
        Guid id,
        Guid workflowId,
        int order,
        string jsonPath,
        RuleOperator @operator,
        string compareValue,
        WorkflowActionType actionType,
        string? actionPayload) : base(id)
    {
        WorkflowId = workflowId;
        Order = order;
        JsonPath = Check.NotNullOrWhiteSpace(jsonPath, nameof(jsonPath), maxLength: WorkflowConsts.MaxJsonPathLength);
        Operator = @operator;
        CompareValue = Check.NotNull(compareValue, nameof(compareValue), maxLength: WorkflowConsts.MaxCompareValueLength);
        ActionType = actionType;
        ActionPayload = actionPayload;
    }
}
