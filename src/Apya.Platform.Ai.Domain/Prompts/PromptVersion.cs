using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// An immutable snapshot of a <see cref="Prompt"/>'s content at a point in time.
/// Child entity of the <see cref="Prompt"/> aggregate — created/published/archived only through
/// the aggregate root so the "at most one published version" invariant stays consistent.
/// Historical <c>AiEvaluation</c> rows reference a specific version id, so archived versions are
/// retained forever (audit trail / reproducibility).
/// </summary>
public class PromptVersion : Entity<Guid>
{
    public Guid PromptId { get; private set; }

    /// <summary>Monotonic, human-friendly version number (1, 2, 3...).</summary>
    public int VersionNo { get; private set; }

    public string SystemPrompt { get; private set; } = string.Empty;

    /// <summary>User message template with <c>{{key}}</c> placeholders (rendered from form answers).</summary>
    public string UserPromptTemplate { get; private set; } = string.Empty;

    /// <summary>Optional JSON Schema the AI output must validate against (schema-driven output).</summary>
    public string? JsonSchema { get; private set; }

    /// <summary>Optional example of the expected JSON output (few-shot / documentation).</summary>
    public string? ExpectedOutputSample { get; private set; }

    public PromptVersionStatus Status { get; private set; }

    public DateTime? PublishedAt { get; private set; }

    protected PromptVersion() { }

    internal PromptVersion(
        Guid id,
        Guid promptId,
        int versionNo,
        string systemPrompt,
        string userPromptTemplate,
        string? jsonSchema,
        string? expectedOutputSample) : base(id)
    {
        PromptId = promptId;
        VersionNo = versionNo;
        SystemPrompt = systemPrompt ?? string.Empty;
        UserPromptTemplate = userPromptTemplate ?? string.Empty;
        JsonSchema = jsonSchema;
        ExpectedOutputSample = expectedOutputSample;
        Status = PromptVersionStatus.Draft;
    }

    internal void Publish(DateTime now)
    {
        Status = PromptVersionStatus.Published;
        PublishedAt = now;
    }

    internal void Archive()
    {
        Status = PromptVersionStatus.Archived;
    }

    /// <summary>
    /// Adapts this version to the existing <see cref="PromptTemplate"/> value object so the proven
    /// <c>RenderUserMessage</c> placeholder-substitution logic is reused rather than duplicated (D3).
    /// </summary>
    public PromptTemplate ToTemplate(string promptCode)
    {
        return new PromptTemplate(
            name: promptCode,
            version: $"v{VersionNo}",
            systemPrompt: SystemPrompt,
            userMessageTemplate: UserPromptTemplate);
    }
}
