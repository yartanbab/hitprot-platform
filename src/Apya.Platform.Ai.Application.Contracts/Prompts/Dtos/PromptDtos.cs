using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.Prompts.Dtos;

/// <summary>List/grid projection of a prompt.</summary>
public class PromptDto : EntityDto<Guid>
{
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? ActiveVersionId { get; set; }
    public bool IsActive { get; set; }
    public int VersionCount { get; set; }
}

/// <summary>Detail projection including the full version history.</summary>
public class PromptDetailDto : PromptDto
{
    public List<PromptVersionDto> Versions { get; set; } = new();
}

public class GetPromptsInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
    public Guid? CategoryId { get; set; }
    public bool? IsActive { get; set; }
}
