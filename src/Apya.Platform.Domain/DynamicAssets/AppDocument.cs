using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Aggregate Root representing a dynamic document (form, table, or template).
/// Manages its child <see cref="AppBlock"/> collection through domain methods
/// to enforce invariants and encapsulation.
/// </summary>
public class AppDocument : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public string Title { get; private set; } = null!;

    public bool IsTemplate { get; private set; }

    public Guid? ParentTemplateId { get; private set; }

    public Guid? TenantId { get; set; }

    public string Slug { get; private set; } = null!;

    private readonly List<AppBlock> _blocks = new();

    /// <summary>
    /// Exposes the block collection as a read-only list to prevent external mutation.
    /// All modifications must go through domain methods.
    /// </summary>
    public IReadOnlyList<AppBlock> Blocks => _blocks.AsReadOnly();

    /// <summary>
    /// Required by EF Core and ABP for deserialization.
    /// </summary>
    protected AppDocument()
    {
    }

    public AppDocument(
        Guid id,
        string title,
        string slug,
        bool isTemplate = false,
        Guid? parentTemplateId = null)
        : base(id)
    {
        SetTitle(title);
        SetSlug(slug);
        IsTemplate = isTemplate;
        ParentTemplateId = parentTemplateId;
    }

    /// <summary>
    /// Adds a new block to this document.
    /// </summary>
    public AppBlock AddBlock(
        Guid blockId,
        BlockType type,
        int order,
        string content,
        string settings,
        string? agentContext = null)
    {
        var block = new AppBlock(blockId, Id, type, order, content, settings, agentContext);
        _blocks.Add(block);
        return block;
    }

    /// <summary>
    /// Removes a block from this document.
    /// Throws <see cref="BusinessException"/> if the block is not found.
    /// </summary>
    public void RemoveBlock(Guid blockId)
    {
        var block = _blocks.FirstOrDefault(b => b.Id == blockId);

        if (block is null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentBlockNotFound);
        }

        _blocks.Remove(block);
    }

    /// <summary>
    /// Updates the display order of a specific block.
    /// Throws <see cref="BusinessException"/> if the block is not found.
    /// </summary>
    public void UpdateBlockOrder(Guid blockId, int newOrder)
    {
        var block = _blocks.FirstOrDefault(b => b.Id == blockId);

        if (block is null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentBlockNotFound);
        }

        block.SetOrder(newOrder);
    }

    /// <summary>
    /// Sets the document title with a guard clause for empty values.
    /// </summary>
    public void SetTitle(string title)
    {
        Title = Check.NotNullOrWhiteSpace(
            title,
            nameof(title),
            maxLength: AppDocumentConsts.MaxTitleLength);
    }

    /// <summary>
    /// Sets the document slug with a guard clause for empty values.
    /// </summary>
    public void SetSlug(string slug)
    {
        Slug = Check.NotNullOrWhiteSpace(
            slug,
            nameof(slug),
            maxLength: AppDocumentConsts.MaxSlugLength);
    }
}
