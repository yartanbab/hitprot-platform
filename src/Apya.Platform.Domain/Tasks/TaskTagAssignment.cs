using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>Görev &lt;-&gt; Tag many-to-many bağlantısı (TaskDependency ile aynı desen).</summary>
public class TaskTagAssignment : Entity<Guid>
{
    public Guid TaskId { get; set; }
    public Guid TagId { get; set; }

    public TaskTagAssignment() { }

    public TaskTagAssignment(Guid id, Guid taskId, Guid tagId) : base(id)
    {
        TaskId = taskId;
        TagId = tagId;
    }
}
