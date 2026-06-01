using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Ai.Prompts.Dtos;

/// <summary>Creating a prompt also seeds its first (Draft) version.</summary>
public class CreatePromptDto
{
    [Required]
    [StringLength(PromptConsts.MaxCodeLength)]
    public string Code { get; set; } = null!;

    [Required]
    [StringLength(PromptConsts.MaxNameLength)]
    public string Name { get; set; } = null!;

    [StringLength(PromptConsts.MaxDescriptionLength)]
    public string? Description { get; set; }

    public Guid? CategoryId { get; set; }

    // First version content
    public string SystemPrompt { get; set; } = string.Empty;
    public string UserPromptTemplate { get; set; } = string.Empty;
    public string? JsonSchema { get; set; }
    public string? ExpectedOutputSample { get; set; }
}

public class UpdatePromptDto
{
    [Required]
    [StringLength(PromptConsts.MaxNameLength)]
    public string Name { get; set; } = null!;

    [StringLength(PromptConsts.MaxDescriptionLength)]
    public string? Description { get; set; }

    public Guid? CategoryId { get; set; }

    public bool IsActive { get; set; }
}

public class CreatePromptVersionDto
{
    public string SystemPrompt { get; set; } = string.Empty;
    public string UserPromptTemplate { get; set; } = string.Empty;
    public string? JsonSchema { get; set; }
    public string? ExpectedOutputSample { get; set; }
}
