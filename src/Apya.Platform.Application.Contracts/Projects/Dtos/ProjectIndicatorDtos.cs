using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects;

public class ProjectIndicatorDto : FullAuditedEntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public string Name { get; set; } = null!;
    public string? Unit { get; set; }
    public decimal BaselineValue { get; set; }
    public decimal TargetValue { get; set; }
    public DateTime? TargetDate { get; set; }
    public Guid? WorkStepId { get; set; }
    public string? WorkStepName { get; set; }

    /// <summary>En son tarihli ölçümün değeri; ölçüm yoksa başlangıç değeri.</summary>
    public decimal CurrentValue { get; set; }
    public DateTime? LastEntryDate { get; set; }
    public int EntryCount { get; set; }

    /// <summary>Başlangıçtan hedefe gidilen yolun yüzdesi (0-100).</summary>
    public int ProgressPercent { get; set; }
    public ProjectIndicatorStatus Status { get; set; }
}

public class CreateUpdateProjectIndicatorDto
{
    /// <summary>Yalnız oluşturmada okunur; gösterge başka projeye taşınmaz.</summary>
    public Guid ProjectId { get; set; }

    [Required]
    [StringLength(ProjectIndicatorConsts.MaxNameLength)]
    public string Name { get; set; } = null!;

    [StringLength(ProjectIndicatorConsts.MaxUnitLength)]
    public string? Unit { get; set; }

    public decimal BaselineValue { get; set; }
    public decimal TargetValue { get; set; }
    public DateTime? TargetDate { get; set; }
    public Guid? WorkStepId { get; set; }
}

public class ProjectIndicatorEntryDto : CreationAuditedEntityDto<Guid>
{
    public Guid IndicatorId { get; set; }
    public DateTime EntryDate { get; set; }
    public decimal Value { get; set; }
    public string? Note { get; set; }
    public Guid? DocumentFileId { get; set; }

    /// <summary>Kanıt belgesinin adı; yalnız belge görme izni olana dolar.</summary>
    public string? DocumentName { get; set; }
}

public class CreateProjectIndicatorEntryDto
{
    public DateTime EntryDate { get; set; }
    public decimal Value { get; set; }

    [StringLength(ProjectIndicatorConsts.MaxEntryNoteLength)]
    public string? Note { get; set; }

    public Guid? DocumentFileId { get; set; }
}
