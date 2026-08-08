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
        public string? ParentTaskTitle { get; set; }

        public Guid? ProjectId { get; set; }
        public string? ProjectName { get; set; }

        /// <summary>Faz 2: Kullanıcı tanımlı kanban kolonu üyeliği (boşsa Status'a göre render).</summary>
        public Guid? BoardColumnId { get; set; }

        /// <summary>Özel kolondaysa kolon adı (liste "Durum" sütunu + dropdown için). Sistem kolonunda boş.</summary>
        public string? BoardColumnName { get; set; }

        public bool IsPrivate { get; set; }

        /// <summary>Mevcut kullanıcının bu görevi favorilediği mi (TaskFavorite join'inden hesaplanır).</summary>
        public bool IsFavorite { get; set; }

        /// <summary>Göreve bağlı giderler (yalnızca Expenses izni olan kullanıcıya doldurulur).</summary>
        public List<TaskFinanceLineDto> Expenses { get; set; } = new List<TaskFinanceLineDto>();
        /// <summary>Göreve bağlı gelirler (yalnızca Incomes izni olan kullanıcıya doldurulur).</summary>
        public List<TaskFinanceLineDto> Incomes { get; set; } = new List<TaskFinanceLineDto>();

        public List<TaskDto> SubTasks { get; set; } = new List<TaskDto>();
        public List<TaskCommentDto> Comments { get; set; } = new List<TaskCommentDto>();
        public List<TaskAttachmentDto> Attachments { get; set; } = new List<TaskAttachmentDto>();
        public List<Guid> PredecessorIds { get; set; } = new List<Guid>();
        public List<TagDto> Tags { get; set; } = new List<TagDto>();
    }
}