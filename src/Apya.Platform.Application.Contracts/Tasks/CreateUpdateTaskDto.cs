using System;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Tasks;

namespace Apya.Platform.Tasks
{
    public class CreateUpdateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; } = DateTime.Now;

        public DateTime? DueDate { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.Todo;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        public Guid? AssigneeId { get; set; }
        public Guid? ParentTaskId { get; set; }
    }
}