using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using System;
using System.Collections.Generic;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev Aggregate Root'u.
/// REV-001: Rich Domain Model — İş kuralları entity içinde kapsüllenir.
/// </summary>
public class TaskItem : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }

    // --- Zamanlama ---
    public DateTime StartDate { get; private set; }
    public DateTime? DueDate { get; private set; }
    public DateTime? CompletedDate { get; private set; }

    public bool IsDeadlineWarningSent { get; private set; } // FEA-002: Deadline uyarısı atıldı mı?

    // --- Durum ve Öncelik ---
    public TaskStatus Status { get; private set; }
    public TaskPriority Priority { get; private set; }
    public Guid? ProjectId { get; private set; }

    // --- Gizlilik ---
    public bool IsPrivate { get; private set; }

    // --- İlişkiler ---
    public Guid? AssigneeId { get; private set; }
    public virtual IdentityUser? Assignee { get; set; }

    // --- Alt Görevler ---
    public Guid? ParentTaskId { get; private set; }
    public virtual TaskItem? ParentTask { get; set; }
    public virtual ICollection<TaskItem> SubTasks { get; set; }

    public virtual ICollection<TaskComment> Comments { get; set; }
    public virtual ICollection<TaskAttachment> Attachments { get; set; }

    // --- EF Core Constructor (protected) ---
    protected TaskItem()
    {
        SubTasks = new List<TaskItem>();
        Comments = new List<TaskComment>();
        Attachments = new List<TaskAttachment>();
    }

    /// <summary>
    /// Factory method — yeni görev oluşturma
    /// </summary>
    public TaskItem(
        Guid id,
        string title,
        Guid? projectId = null,
        Guid? parentTaskId = null,
        string? description = null,
        DateTime? startDate = null,
        DateTime? dueDate = null,
        TaskPriority priority = TaskPriority.Medium,
        Guid? assigneeId = null,
        bool isPrivate = false) : base(id)
    {
        SetTitle(title);
        Description = description;
        ProjectId = projectId;
        ParentTaskId = parentTaskId;
        StartDate = startDate ?? DateTime.Now;
        DueDate = dueDate;
        Priority = priority;
        AssigneeId = assigneeId;
        IsPrivate = isPrivate;

        Status = TaskStatus.Todo;

        SubTasks = new List<TaskItem>();
        Comments = new List<TaskComment>();
        Attachments = new List<TaskAttachment>();
    }

    // ==================== DOMAIN METHODS ====================

    /// <summary>
    /// Görev başlığını değiştirir. Boş olamaz.
    /// </summary>
    public void SetTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.TaskTitleRequired)
                .WithData("Title", title);
        Title = title.Trim();
    }

    /// <summary>
    /// Görev açıklamasını günceller.
    /// </summary>
    public void SetDescription(string description)
    {
        Description = description;
    }

    /// <summary>
    /// Görev durumunu değiştirir. Done olursa tamamlanma tarihi otomatik atanır.
    /// </summary>
    public void ChangeStatus(TaskStatus newStatus, DateTime? now = null)
    {
        if (Status == newStatus) return;

        var oldStatus = Status;
        Status = newStatus;

        if (newStatus == TaskStatus.Done && oldStatus != TaskStatus.Done)
        {
            CompletedDate = now ?? DateTime.Now;
        }
        else if (newStatus != TaskStatus.Done)
        {
            CompletedDate = null; // Done'dan geri alınırsa temizle
        }
    }

    /// <summary>
    /// Öncelik seviyesini günceller.
    /// </summary>
    public void ChangePriority(TaskPriority newPriority)
    {
        Priority = newPriority;
    }

    /// <summary>
    /// Görevi bir kişiye atar. Null geçilirse atamayı kaldırır.
    /// </summary>
    public Guid? AssignTo(Guid? userId)
    {
        var previousAssignee = AssigneeId;
        AssigneeId = userId;
        return previousAssignee;
    }

    public void RemoveAssignee()
    {
        AssigneeId = null;
    }

    /// <summary>
    /// FEA-002: Deadline uyarısı atıldığını işaretler
    /// </summary>
    public void MarkDeadlineWarningAsSent()
    {
        IsDeadlineWarningSent = true;
    }

    /// <summary>
    /// Zamanlama bilgilerini günceller.
    /// </summary>
    public void UpdateSchedule(DateTime startDate, DateTime? dueDate)
    {
        StartDate = startDate;
        DueDate = dueDate;
    }

    /// <summary>
    /// Gizlilik ayarını günceller.
    /// </summary>
    public void SetPrivacy(bool isPrivate)
    {
        IsPrivate = isPrivate;
    }

    /// <summary>
    /// Tüm düzenlenebilir alanları tek seferde günceller (Application Service kullanımı için).
    /// </summary>
    public Guid? Update(
        string title,
        string description,
        DateTime startDate,
        DateTime? dueDate,
        TaskPriority priority,
        TaskStatus status,
        Guid? assigneeId,
        bool isPrivate,
        DateTime? now = null)
    {
        SetTitle(title);
        SetDescription(description);
        UpdateSchedule(startDate, dueDate);
        ChangePriority(priority);
        ChangeStatus(status, now);
        SetPrivacy(isPrivate);
        return AssignTo(assigneeId);
    }
}