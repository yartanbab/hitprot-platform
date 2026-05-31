using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.DynamicAssets.Dtos;

/// <summary>
/// Output DTO for a <see cref="FormCategory"/>.
/// </summary>
public class FormCategoryDto : FullAuditedEntityDto<Guid>
{
    public string Name { get; set; } = null!;
    public string? Color { get; set; }
    public string? Icon { get; set; }
    public int Order { get; set; }
}

/// <summary>
/// Input DTO for creating/updating a <see cref="FormCategory"/>.
/// </summary>
public class CreateUpdateFormCategoryDto
{
    [Required]
    [StringLength(FormCategoryConsts.MaxNameLength)]
    public string Name { get; set; } = null!;

    [StringLength(FormCategoryConsts.MaxColorLength)]
    public string? Color { get; set; }

    [StringLength(FormCategoryConsts.MaxIconLength)]
    public string? Icon { get; set; }

    public int Order { get; set; }
}
