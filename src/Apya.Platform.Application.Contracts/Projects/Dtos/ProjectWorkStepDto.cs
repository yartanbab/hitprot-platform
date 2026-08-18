using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects;

public class ProjectWorkStepDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public Guid ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public int Order { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int ProgressPercent { get; set; }

    /// <summary>Bağlam ağacındaki satır sayacı — bu adıma bağlı belge sayısı.</summary>
    public int DocumentCount { get; set; }
}

public class CreateUpdateProjectWorkStepDto
{
    public Guid ProjectId { get; set; }

    public int Order { get; set; }

    [Required]
    [StringLength(ProjectWorkStepConsts.MaxNameLength)]
    public string Name { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    [Range(0, 100)]
    public int ProgressPercent { get; set; }
}
