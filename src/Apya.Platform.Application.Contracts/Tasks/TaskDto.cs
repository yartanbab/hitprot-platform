using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskDto : AuditedEntityDto<Guid>
    {
        public string Title { get; set; } = string.Empty; // Başlangıç değeri verdik
        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        // Enum'lar için namespace çakışmasını önlemek için tam yol yazıyoruz
        public Apya.Platform.Tasks.TaskStatus Status { get; set; }
        public Apya.Platform.Tasks.TaskPriority Priority { get; set; }

        public Guid? AssigneeId { get; set; }
        public string? AssigneeName { get; set; } // Soru işareti (?) ekledik: Null olabilir
        public Guid? ParentTaskId { get; set; }

        public List<TaskDto> SubTasks { get; set; } = new List<TaskDto>(); // Listeyi başlattık
    }
}