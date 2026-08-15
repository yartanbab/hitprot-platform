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

    /// <summary>Yayın ayarı: KVKK aydınlatma onayı zorunlu mu? (frontend onay kutusu render eder)</summary>
    public bool RequireKvkk { get; set; }

    /// <summary>Yayın ayarı: bot koruması (honeypot + zamanlama) etkin mi?</summary>
    public bool RequireCaptcha { get; set; }
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

    /// <summary>KVKK aydınlatma onayı işaretlendi mi (form KVKK istiyorsa zorunlu).</summary>
    public bool KvkkConsent { get; set; }

    /// <summary>
    /// Honeypot: insan boş bırakır, bot doldurur. Dolu gelirse gönderim reddedilir.
    /// Görünmez alan olarak render edilir (public-form.jsx).
    /// </summary>
    public string? Website { get; set; }
}
