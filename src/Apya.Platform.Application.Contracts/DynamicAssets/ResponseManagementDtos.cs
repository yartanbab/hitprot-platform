using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.DynamicAssets.Dtos;

/// <summary>List row for the responses grid / spreadsheet (includes answers for table view & export).</summary>
public class ResponseListItemDto : CreationAuditedEntityDto<Guid>
{
    public Guid DocumentId { get; set; }
    public Guid? RespondentId { get; set; }
    public ResponseStatus Status { get; set; }
    public int? CompletionSeconds { get; set; }
    public string? TagsJson { get; set; }

    /// <summary>JSON answers keyed by block id (for the spreadsheet view and CSV export).</summary>
    public string Answers { get; set; } = null!;
}

/// <summary>Full response detail incl. answers and reviewer comments.</summary>
public class ResponseDetailDto : CreationAuditedEntityDto<Guid>
{
    public Guid DocumentId { get; set; }
    public Guid? RespondentId { get; set; }
    public string Answers { get; set; } = null!;
    public ResponseStatus Status { get; set; }
    public string? TagsJson { get; set; }
    public int? CompletionSeconds { get; set; }
    public string? RespondentMetaJson { get; set; }
    public List<ResponseCommentDto> Comments { get; set; } = new();
}

public class ResponseCommentDto : CreationAuditedEntityDto<Guid>
{
    public string Text { get; set; } = null!;
}

/// <summary>Filter + paging for listing responses.</summary>
public class ResponseListFilterDto : PagedAndSortedResultRequestDto
{
    public Guid? DocumentId { get; set; }
    public ResponseStatus? Status { get; set; }
}

public class SetResponseStatusDto
{
    public ResponseStatus Status { get; set; }
}

public class SetResponseTagsDto
{
    public string? TagsJson { get; set; }
}

public class AddResponseCommentDto
{
    [Required]
    [StringLength(ResponseCommentConsts.MaxTextLength)]
    public string Text { get; set; } = null!;
}
