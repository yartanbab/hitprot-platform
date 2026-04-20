using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Child entity belonging to <see cref="AppDocument"/>.
/// Represents a single form element, content section, or table grid within a document.
/// Content, Settings, and AgentContext are stored as JSON (mapped to JSONB in PostgreSQL).
/// </summary>
public class AppBlock : Entity<Guid>
{
    public Guid AppDocumentId { get; private set; }

    public BlockType Type { get; private set; }

    public int Order { get; private set; }

    /// <summary>
    /// JSON payload holding the block's actual content/value.
    /// </summary>
    public string Content { get; private set; } = null!;

    /// <summary>
    /// JSON payload holding the block's configuration (e.g., validation rules, labels, options).
    /// </summary>
    public string Settings { get; private set; } = null!;

    /// <summary>
    /// Optional JSON payload providing context for LLM-based processing.
    /// </summary>
    public string? AgentContext { get; private set; }

    /// <summary>
    /// Required by EF Core for deserialization.
    /// </summary>
    protected AppBlock()
    {
    }

    public AppBlock(
        Guid id,
        Guid appDocumentId,
        BlockType type,
        int order,
        string content,
        string settings,
        string? agentContext = null)
        : base(id)
    {
        AppDocumentId = appDocumentId;
        Type = type;
        Order = order;
        Content = Check.NotNull(content, nameof(content));
        Settings = Check.NotNull(settings, nameof(settings));
        AgentContext = agentContext;
    }

    /// <summary>
    /// Updates the display order. Called internally by <see cref="AppDocument.UpdateBlockOrder"/>.
    /// </summary>
    internal void SetOrder(int order)
    {
        Order = order;
    }

    public void SetContent(string content)
    {
        Content = Check.NotNull(content, nameof(content));
    }

    public void SetSettings(string settings)
    {
        Settings = Check.NotNull(settings, nameof(settings));
    }

    public void SetAgentContext(string? agentContext)
    {
        AgentContext = agentContext;
    }
}
