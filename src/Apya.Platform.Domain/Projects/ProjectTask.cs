using System;
using System.Collections.Generic; // ICollection ve List için gerekli
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Projects;

public class ProjectTask : FullAuditedEntity<Guid>
{
    public Guid ProjectId { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public int Status { get; set; }
    public int Priority { get; set; }
    public Guid? AssigneeId { get; set; }

    // --- EKSİK OLAN HAYATİ KISIM BURASI ---
    // Eğer SubTask ve TaskComment sınıflarının adını farklı yaptıysan (örn: ProjectSubTask), 
    // aşağıdaki kelimeleri ona göre değiştir.
    public virtual ICollection<SubTask> SubTasks { get; set; }
    public virtual ICollection<TaskComment> Comments { get; set; }

    // Yapıcı metot (Constructor) içinde bu listeleri başlatmalıyız ki NullReference yemesin
    public ProjectTask()
    {
        SubTasks = new List<SubTask>();
        Comments = new List<TaskComment>();
    }
}