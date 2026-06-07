namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// Centralized field-length constraints for the prompt management aggregates.
/// Shared between the Domain (guard clauses) and EntityFrameworkCore (column mapping) layers.
/// </summary>
public static class PromptConsts
{
    public const int MaxNameLength = 200;
    public const int MaxCodeLength = 100;
    public const int MaxDescriptionLength = 1000;

    // System/User prompt bodies and JSON schema are stored as unbounded "text" columns.
    public const int MaxCategoryNameLength = 150;
    public const int MaxCategoryCodeLength = 100;
}
