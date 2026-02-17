using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Projects;

public class SubTask : FullAuditedEntity<Guid>
{
    public Guid ProjectTaskId { get; set; } // Hangi ana göreve ait olduğunu tutar
    public string Title { get; set; } = default!;
    public bool IsCompleted { get; set; }

    public SubTask()
    {
    }

    public SubTask(Guid id, Guid projectTaskId, string title, bool isCompleted = false)
        : base(id)
    {
        ProjectTaskId = projectTaskId;
        Title = title;
        IsCompleted = isCompleted;
    }
}