namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// Field-length constraints for evaluation result aggregates.
/// RawJson and Summary are stored as unbounded "text" columns.
/// </summary>
public static class EvaluationConsts
{
    public const int MaxRiskLevelLength = 50;
    public const int MaxDecisionLength = 100;
    public const int MaxErrorMessageLength = 2000;
}
