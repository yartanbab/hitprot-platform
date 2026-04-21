using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tasks
{
    public class TaskComment : FullAuditedEntity<Guid>
    {
        public Guid TaskId { get; set; } // Hangi göreve ait?
        public string Text { get; set; } = null!; // Yorum içeriği

        // Constructor
        public TaskComment() { }

        public TaskComment(Guid taskId, string text)
        {
            TaskId = taskId;
            SetText(text);
        }

        public void SetText(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Volo.Abp.BusinessException("Platform:Task:CommentRequired", "Yorum içeriği boş olamaz.");
            }
            Text = text.Trim();
        }
    }
}