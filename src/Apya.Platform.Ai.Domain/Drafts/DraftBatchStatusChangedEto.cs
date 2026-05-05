using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Ai.Drafts;

[EventName("apya.ai.draft-batch.status-changed.v1")]
public class DraftBatchStatusChangedEto
{
    public Guid BatchId { get; set; }
    public Guid? TenantId { get; set; }
    public Guid? UserId { get; set; }
    public DraftBatchStatus NewStatus { get; set; }
    public int TotalItems { get; set; }
    public int ApprovedItems { get; set; }
    public string? ErrorMessage { get; set; }
}
