using System;

namespace Apya.Platform.Tasks;

/// <summary>Bir görev atandığında yayınlanan yerel etkinlik.</summary>
public class TaskAssignedEto
{
    public Guid   TaskId       { get; set; }
    public string TaskTitle    { get; set; } = string.Empty;
    public Guid   AssigneeId   { get; set; }
    public string AssignerName { get; set; } = string.Empty;
}
