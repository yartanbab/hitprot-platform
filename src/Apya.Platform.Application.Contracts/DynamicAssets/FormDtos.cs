using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.DynamicAssets.Dtos;

/// <summary>
/// Lightweight list-item DTO for the forms grid/list (no blocks payload).
/// </summary>
public class FormListItemDto : FullAuditedEntityDto<Guid>
{
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public FormStatus Status { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Description { get; set; }
    public bool IsTemplate { get; set; }
    public long ViewCount { get; set; }
    public long ResponseCount { get; set; }
    public DateTime? PublishedAt { get; set; }
}

/// <summary>
/// Filter + paging input for listing forms.
/// </summary>
public class FormListFilterDto : PagedAndSortedResultRequestDto
{
    public FormStatus? Status { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Filter { get; set; }
}

/// <summary>
/// Input DTO for creating/updating a form. On create, optional initial blocks
/// may be supplied; on update only the metadata is applied (block editing is
/// handled by the builder in a later phase).
/// </summary>
public class CreateUpdateFormDto
{
    [Required]
    [StringLength(AppDocumentConsts.MaxTitleLength)]
    public string Title { get; set; } = null!;

    [StringLength(AppDocumentConsts.MaxDescriptionLength)]
    public string? Description { get; set; }

    public Guid? CategoryId { get; set; }

    public string? ThemeJson { get; set; }

    /// <summary>Initial blocks (used on create only).</summary>
    public List<CreateBlockDto> Blocks { get; set; } = new();
}

/// <summary>
/// Input DTO for replacing a form's full block set (builder save).
/// </summary>
public class UpdateFormBlocksDto
{
    public List<CreateBlockDto> Blocks { get; set; } = new();
}

/// <summary>
/// Input DTO for publishing a form.
/// </summary>
public class PublishFormDto
{
    /// <summary>Optional override slug; if null the current slug is kept.</summary>
    public string? Slug { get; set; }

    /// <summary>JSON publish settings (domain, password, dates, captcha, KVKK/cookie consent).</summary>
    public string? PublishSettingsJson { get; set; }
}

/// <summary>
/// Aggregated statistics for a single form.
/// </summary>
public class FormStatisticsDto
{
    public long ViewCount { get; set; }
    public long ResponseCount { get; set; }
    public long TodayResponseCount { get; set; }
    public long PendingResponseCount { get; set; }
}
