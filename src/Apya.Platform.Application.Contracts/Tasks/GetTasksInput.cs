using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks;

public class GetTasksInput : PagedAndSortedResultRequestDto
{
    // Görevleri projeye göre filtrelemek için kullanacağımız parametre
    public Guid? ProjectId { get; set; }
    
    // Gelişmiş Filtreleme (Advanced Search) Alanları
    public Guid? TenantId { get; set; }
    public Guid? AssigneeId { get; set; }
    public List<TaskStatus>? Statuses { get; set; }
    public List<TaskPriority>? Priorities { get; set; }
    public DateTime? MinDueDate { get; set; }
    public DateTime? MaxDueDate { get; set; }

    /// <summary>Serbest-metin arama (Title/Description üzerinde).</summary>
    public string? Filter { get; set; }

    /// <summary>Yalnız kök görevler (alt görevi olmayanlar listede satır açmaz).
    /// Görev listesi hiyerarşik kipteyken bunu gönderir; sayfalama kök görevler
    /// üzerinden yürür, alt görevler chevron ile ayrıca istenir.</summary>
    public bool RootOnly { get; set; }

    /// <summary>Belirli bir üst görevin alt görevleri — chevron açıldığında
    /// tembel yükleme için. RootOnly ile birlikte kullanılmaz.</summary>
    public Guid? ParentTaskId { get; set; }
}