using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Ai.Prompts.Dtos;

public class PromptCategoryDto : EntityDto<Guid>
{
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public Guid? ParentId { get; set; }
    public string? Description { get; set; }
}

public class CreateUpdatePromptCategoryDto
{
    [Required]
    [StringLength(PromptConsts.MaxCategoryNameLength)]
    public string Name { get; set; } = null!;

    [Required]
    [StringLength(PromptConsts.MaxCategoryCodeLength)]
    public string Code { get; set; } = null!;

    public Guid? ParentId { get; set; }

    [StringLength(PromptConsts.MaxDescriptionLength)]
    public string? Description { get; set; }
}
