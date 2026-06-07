namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// Lifecycle status of an <c>AiPromptVersion</c>.
/// A prompt may have at most one <see cref="Published"/> version active at a time;
/// superseded versions move to <see cref="Archived"/> and are retained for audit trail
/// (historical evaluations stay linked to the exact version that produced them).
/// </summary>
public enum PromptVersionStatus
{
    Draft = 0,
    Published = 1,
    Archived = 2
}
