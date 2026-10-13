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
    /// <summary>
    /// GEÇERLİ ilerleme: adıma bağlı görev varsa onlardan hesaplanır, yoksa elle girilen değerdir.
    /// </summary>
    public int ProgressPercent { get; set; }

    /// <summary>İlerleme görevlerden mi hesaplandı (true) yoksa elle mi girildi (false).</summary>
    public bool ProgressFromTasks { get; set; }

    /// <summary>Adıma bağlı, iptal edilmemiş görev sayısı ve bunların tamamlananı.</summary>
    public int TaskCount { get; set; }
    public int CompletedTaskCount { get; set; }

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
