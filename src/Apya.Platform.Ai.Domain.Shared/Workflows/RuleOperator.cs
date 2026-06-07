namespace Apya.Platform.Ai.Workflows;

/// <summary>
/// Comparison operator used by an <c>AiWorkflowRule</c> to test a value extracted
/// from the AI result JSON (via a JSON path) against a configured compare value.
/// </summary>
public enum RuleOperator
{
    Equal = 0,
    NotEqual = 1,
    GreaterThan = 2,
    GreaterOrEqual = 3,
    LessThan = 4,
    LessOrEqual = 5,
    Contains = 6,
    NotContains = 7
}
