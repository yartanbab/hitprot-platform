using System;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Tasks;

namespace Apya.Platform.Tasks
{
    public class CreateUpdateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; } = DateTime.Today; // DTO katmanı: IClock inject edilemez, Date-only yeterli

        public DateTime? DueDate { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.Todo;

        /// <summary>
        /// Faz 2/kanban paritesi: görev özel bir kanban kolonuna atanacaksa kolon Id'si.
        /// Doluysa görev o kolona bağlanır (Status değişmez); null ise görev Status'a
        /// göre sistem kolonunda görünür. Modal "Durum/Kolon" dropdown'ı buradan beslenir.
        /// </summary>
        public Guid? BoardColumnId { get; set; }

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public Guid? ProjectId { get; set; }

        public Guid? AssigneeId { get; set; }
        public Guid? ParentTaskId { get; set; }
        public bool IsPrivate { get; set; }
        public System.Collections.Generic.List<Guid> PredecessorIds { get; set; } = new();
    }
}