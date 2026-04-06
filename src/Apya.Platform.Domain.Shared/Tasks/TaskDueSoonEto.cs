using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Tasks;

[EventName("Apya.Platform.Tasks.TaskDueSoon")]
public class TaskDueSoonEto
{
    public Guid TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public Guid AssigneeId { get; set; }
    public Guid CreatorId { get; set; }
    public DateTime DueDate { get; set; }
}
