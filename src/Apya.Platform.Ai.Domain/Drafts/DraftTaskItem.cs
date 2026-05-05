using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Tasks;

namespace Apya.Platform.Ai.Drafts;

public class DraftTaskItem : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid? ProjectId { get; private set; }
    public Guid ImportBatchId { get; private set; }
    public Guid? DraftBatchId { get; private set; }

    public string Title { get; private set; } = null!;
    public string? Description { get; private set; }
    public TaskPriority Priority { get; private set; }
    public double EstimatedHours { get; private set; }
    public bool IsApproved { get; private set; }

    protected DraftTaskItem() { }

    public DraftTaskItem(
        Guid id,
        Guid importBatchId,
        string title,
        string? description,
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

    public void LinkToBatch(Guid draftBatchId) => DraftBatchId = draftBatchId;

    public void MarkAsApproved() => IsApproved = true;
}
