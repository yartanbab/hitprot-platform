using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using System;

namespace Apya.Platform.Tasks.Drafts;

/// <summary>
/// AI tarafından üretilen ancak henüz onaylanmamış taslak görevleri tutar.
/// </summary>
public class DraftTaskItem : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    
    // Taslağın ait olduğu proje (Kullanıcı AI tetiklerken proje seçebilir)
    public Guid? ProjectId { get; private set; }

    // Hangi import işleminden (batch) geldiği (Örn: "Toplantı.pdf" yüklemesi)
    public Guid ImportBatchId { get; private set; }

    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public TaskPriority Priority { get; private set; }
    public double EstimatedHours { get; private set; }
    
    public bool IsApproved { get; private set; }

    protected DraftTaskItem() { } // EF Core için

    public DraftTaskItem(
        Guid id, 
        Guid importBatchId,
        string title, 
        string description, 
        TaskPriority priority,
        double estimatedHours,
        Guid? projectId = null,
        Guid? tenantId = null) : base(id)
    {
        ImportBatchId = importBatchId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
        Priority = priority;
        EstimatedHours = estimatedHours;
        ProjectId = projectId;
        TenantId = tenantId;
        IsApproved = false;
    }

    public void MarkAsApproved()
    {
        IsApproved = true;
    }
}
