using System.Collections.Generic;

namespace Apya.Platform.Ai.Workflows;

/// <summary>An action produced by a matched <see cref="AiWorkflowRule"/>.</summary>
public record WorkflowActionMatch(WorkflowActionType ActionType, string? ActionPayload);

/// <summary>
/// Pure evaluation of workflow rules against an AI result JSON. Stateless and side-effect free —
/// returns the actions that matched; dispatch is handled separately (NotificationManager, webhook job).
/// </summary>
public interface IAiWorkflowEvaluator
{
    IReadOnlyList<WorkflowActionMatch> Evaluate(string resultJson, IEnumerable<AiWorkflowRule> rules);
}
