using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using System;
using System.Collections.Generic;

namespace Apya.Platform.Tasks;

// FullAuditedAggregateRoot: ID, Soft Delete, CreationTime, CreatorId, LastModificationTime hepsini otomatik verir.
public class TaskItem : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    // --- Zamanlama ---
    public DateTime StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedDate { get; set; }

    // --- Durum ve Öncelik (Enumlarımız) ---
    public TaskStatus Status { get; set; }
    public TaskPriority Priority { get; set; }
    public Guid? ProjectId { get; set; } // Görev bir projeye ait olabilir veya bağımsız olabilir

    // --- Gizlilik (Başkası adına girişte saklama) ---
    public bool IsPrivate { get; set; }

    // --- İlişkiler ---

    // Görevi Atanan Kişi (ABP IdentityUser ile ilişki)
    public Guid? AssigneeId { get; set; }

    // Bu property veritabanında tablo oluştururken ilişkiyi tanımlar ama 
    // Domain katmanında IdentityUser'a direkt bağımlılık vermek bazen istenmez. 
    // Yine de navigasyon için ekleyebiliriz:
    public virtual IdentityUser Assignee { get; set; }

    // --- Alt Görevler (Sub-Tasks) ---
    public Guid? ParentTaskId { get; set; }
    public virtual TaskItem ParentTask { get; set; }
    public virtual ICollection<TaskItem> SubTasks { get; set; }

    public virtual ICollection<TaskComment> Comments { get; set; }
    public virtual ICollection<TaskAttachment> Attachments { get; set; }

    // Constructor: Varsayılan değerleri atarız
    public TaskItem()
    {
        // Listeyi initialize etmezsek "Null Reference" hatası alırız
        SubTasks = new List<TaskItem>();
        Comments = new List<TaskComment>();
        Attachments = new List<TaskAttachment>();

        // Varsayılanlar
        Status = TaskStatus.Todo;
        Priority = TaskPriority.Medium;
        StartDate = DateTime.Now;
    }
}