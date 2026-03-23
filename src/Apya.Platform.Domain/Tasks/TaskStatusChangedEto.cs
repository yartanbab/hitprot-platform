using System;

namespace Apya.Platform.Tasks;

public class TaskStatusChangedEto
{
    public Guid TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public TaskStatus OldStatus { get; set; }
    public TaskStatus NewStatus { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? CreatorId { get; set; }
    public string ChangedByName { get; set; } = string.Empty;
}
