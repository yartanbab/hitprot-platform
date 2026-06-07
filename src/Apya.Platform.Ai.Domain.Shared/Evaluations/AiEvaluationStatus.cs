namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// Lifecycle status of a single <c>AiEvaluation</c> (one form submission evaluated by one prompt).
/// Mirrors the proven <c>AiRequestStatus</c> state machine used by the existing draft pipeline.
/// </summary>
public enum AiEvaluationStatus
{
    Pending = 0,
    Processing = 1,
    Completed = 2,
    Failed = 3
}
