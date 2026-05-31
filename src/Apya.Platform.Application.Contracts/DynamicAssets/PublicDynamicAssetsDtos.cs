using System;
using System.Collections.Generic;

namespace Apya.Platform.DynamicAssets.Dtos;

/// <summary>
/// Public-facing DTO for rendering a document/form externally.
/// Contains ONLY the fields needed by the UI to draw the form.
/// No audit data, no system IDs beyond what's necessary.
/// </summary>
public class PublicDocumentDto
{
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Description { get; set; }
    /// <summary>Theme/branding JSON (colors, font, logo, cover) for public rendering.</summary>
    public string? ThemeJson { get; set; }
    public List<PublicBlockDto> Blocks { get; set; } = new();
}

/// <summary>
/// Public-facing DTO for a single form block/element.
/// Exposes only the rendering-relevant fields.
/// </summary>
public class PublicBlockDto
{
    /// <summary>Block id — used as the answer key on submission.</summary>
    public Guid Id { get; set; }
    public BlockType Type { get; set; }
    public int Order { get; set; }
    public string Content { get; set; } = null!;
    public string Settings { get; set; } = null!;
}

/// <summary>
/// Input DTO for submitting a response to a published document.
/// Anonymous users submit answers via the document's unique slug.
/// </summary>
public class SubmitResponseDto
{
    public string DocumentSlug { get; set; } = null!;

    /// <summary>
    /// JSON-formatted answers keyed by block identifiers.
    /// </summary>
    public string Answers { get; set; } = null!;

    /// <summary>How long the respondent took to complete the form, in seconds (optional).</summary>
    public int? CompletionSeconds { get; set; }
}
