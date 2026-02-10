using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tasks
{
    public class TaskComment : FullAuditedEntity<Guid>
    {
        public Guid TaskId { get; set; } // Hangi göreve ait?
        public string Text { get; set; } // Yorum içeriği

        // Constructor
        public TaskComment() { }

        public TaskComment(Guid taskId, string text)
        {
            TaskId = taskId;
            Text = text;
        }
    }
}