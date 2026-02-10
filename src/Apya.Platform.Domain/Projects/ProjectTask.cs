using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Projects;

public class ProjectTask : FullAuditedEntity<Guid>
{
    public Guid ProjectId { get; set; } // Hangi projeye ait?
    public string Title { get; set; }   // Görev adı (Örn: Vergi levhası yükle)
    public string? Description { get; set; } // Detay
    public bool IsCompleted { get; set; } // Tamamlandı mı?
    public DateTime? DueDate { get; set; } // Son tarih
    public TaskState State { get; set; } = TaskState.Todo; // Varsayılan: Yapılacak
    public Guid? AssignedUserId { get; set; } // Boş olabilir (Henüz kimseye atanmamış)


    protected ProjectTask()
    {
    }

    public ProjectTask(Guid id, Guid projectId, string title, string? description = null, DateTime? dueDate = null)
        : base(id)
    {
        ProjectId = projectId;
        Title = title;
        Description = description;
        DueDate = dueDate;
        IsCompleted = false; // Varsayılan: Yapılmadı
    }
}