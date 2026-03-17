using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskDto : AuditedEntityDto<Guid>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        public Apya.Platform.Tasks.TaskStatus Status { get; set; }
        public Apya.Platform.Tasks.TaskPriority Priority { get; set; }

        public Guid? AssigneeId { get; set; }
        public string? AssigneeName { get; set; }
        public Guid? ParentTaskId { get; set; }

        // KİLİT NOKTA: Derleyicinin aradığı ve görevin projeye ait olduğunu belirten alan!
        public Guid? ProjectId { get; set; }

        public bool IsPrivate { get; set; }

        public List<TaskDto> SubTasks { get; set; } = new List<TaskDto>();
        public List<TaskCommentDto> Comments { get; set; } = new List<TaskCommentDto>();
        public List<TaskAttachmentDto> Attachments { get; set; } = new List<TaskAttachmentDto>();
    }
}