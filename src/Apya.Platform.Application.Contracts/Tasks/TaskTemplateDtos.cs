using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks;

/// <summary>Şablon listesi satırı — seçici için yeterli olan özet.</summary>
public class TaskTemplateListDto : EntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string TaskTitle { get; set; } = string.Empty;

    /// <summary>Şablondaki alt görev sayısı (seçicide "3 alt görev" rozeti).</summary>
    public int ItemCount { get; set; }
    public int FeatureCount { get; set; }
}

/// <summary>Şablonun tam içeriği — "Yeni Görev"de ön-doldurma için.</summary>
public class TaskTemplateDto : EntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public string TaskTitle { get; set; } = string.Empty;
    public string? TaskDescription { get; set; }
    public TaskPriority Priority { get; set; }
    public decimal? EstimatedHours { get; set; }
    public string? TaskType { get; set; }

    public List<string> Items { get; set; } = new();
    public List<string> Features { get; set; } = new();
    public List<string> Tags { get; set; } = new();
}

/// <summary>Var olan bir görevden şablon çıkarma isteği.</summary>
public class CreateTaskTemplateFromTaskDto
{
    [Required]
    public Guid TaskId { get; set; }

    [Required]
    [StringLength(128)]
    public string Name { get; set; } = string.Empty;

    [StringLength(512)]
    public string? Description { get; set; }
}

/// <summary>
/// Şablondan görev üretme isteği. Şablon yalnız iskelet verir; sorumlu/tarih/proje
/// burada belirlenir (şablonda tutulmazlar).
/// </summary>
public class ApplyTaskTemplateDto
{
    [Required]
    public Guid TemplateId { get; set; }

    public Guid? ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
}
