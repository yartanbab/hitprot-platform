using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Tasks;

/// <summary>
/// Integration event: published by AI bounded context when a user approves a draft.
/// Consumed by Tasks bounded context to create a real TaskItem.
/// Lives in Domain.Shared as a shared contract between bounded contexts.
/// </summary>
[EventName("apya.tasks.draft-approved.v1")]
public class DraftApprovedEto
{
    public Guid DraftId { get; set; }
    public Guid? TenantId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? ProjectId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public double EstimatedHours { get; set; }
    public Guid ImportBatchId { get; set; }
}
