using System;

namespace Apya.Platform.Tasks;

/// <summary>N-03 · Görevin TEK muhatabına giden değişiklik türü.</summary>
public enum TaskChangeKind
{
    /// <summary>Görev eski sorumludan alındı (başkasına atandı ya da atama kaldırıldı).</summary>
    Unassigned = 1,

    /// <summary>Sorumlunun görevinin son tarihi değişti (ya da kaldırıldı).</summary>
    DueDateChanged = 2,

    /// <summary>Sorumlunun görevinin önceliği Kritik'e çıktı.</summary>
    PriorityRaised = 3
}

/// <summary>N-03 · Değişiklik bildirimi; alıcı olayı yapan kişiyse bildirim gitmez.</summary>
public class TaskChangedEto
{
    public Guid TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public TaskChangeKind Kind { get; set; }
    public Guid RecipientId { get; set; }
    public Guid? ModifierUserId { get; set; }
    public string ChangedByName { get; set; } = string.Empty;
    public DateTime? NewDueDate { get; set; }
}

/// <summary>N-03 · Değişiklikten ÖNCE alınan görev özeti (bildirim farkı bununla hesaplanır).</summary>
public readonly record struct TaskChangeSnapshot(TaskStatus Status, DateTime? DueDate, TaskPriority Priority, Guid? AssigneeId)
{
    public static TaskChangeSnapshot Of(TaskItem task) => new(task.Status, task.DueDate, task.Priority, task.AssigneeId);
}
