using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

public class TaskDependency : Entity<Guid>
{
    public Guid TaskId { get; set; }
    public Guid PredecessorTaskId { get; set; }

    public TaskDependency() { }

    public TaskDependency(Guid id, Guid taskId, Guid predecessorTaskId) : base(id)
    {
        TaskId = taskId;
        PredecessorTaskId = predecessorTaskId;
    }
}
