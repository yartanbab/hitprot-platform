using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

public class ProjectCategoryDto : AuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Tone { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsActive { get; set; }

    /// <summary>Doluysa sistem kategorisidir: silinemez, adı değiştirilemez.</summary>
    public ProjectCategory? SystemKey { get; set; }

    public bool IsSystem => SystemKey.HasValue;

    /// <summary>Bu kategoriyi kullanan proje sayısı — silme/pasife alma uyarısı için.</summary>
    public int ProjectCount { get; set; }
}

public class CreateUpdateProjectCategoryDto
{
    [Required]
    [MaxLength(ProjectCategoryConsts.MaxNameLength)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(ProjectCategoryConsts.MaxIconLength)]
    public string? Icon { get; set; }

    [MaxLength(ProjectCategoryConsts.MaxToneLength)]
    public string? Tone { get; set; }

    public int Order { get; set; }

    public bool IsActive { get; set; } = true;
}
