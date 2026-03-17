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
    public DateTime? MinDueDate { get; set; }
    public DateTime? MaxDueDate { get; set; }
}