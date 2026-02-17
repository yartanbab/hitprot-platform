using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Projects;

public class TaskComment : FullAuditedEntity<Guid>
{
    public Guid ProjectTaskId { get; set; } // Hangi ana göreve ait olduğunu tutar
    public string Text { get; set; } = default!;

    public TaskComment()
    {
    }

    public TaskComment(Guid id, Guid projectTaskId, string text)
        : base(id)
    {
        ProjectTaskId = projectTaskId;
        Text = text;
    }
}