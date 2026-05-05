using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Drafts;

public class DraftBatch : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid? AiRequestId { get; private set; }

    public Guid? ProjectId { get; private set; }

    public DraftBatchStatus Status { get; private set; }

    public string? SourceFileName { get; private set; }

    public int TotalItems { get; private set; }

    public int ApprovedItems { get; private set; }

    protected DraftBatch() { }

    public DraftBatch(
        Guid id,
        Guid? projectId = null,
        Guid? tenantId = null,
        string? sourceFileName = null) : base(id)
    {
        ProjectId = projectId;
        TenantId = tenantId;
        SourceFileName = sourceFileName?.Length > 255
            ? sourceFileName.Substring(0, 255)
            : sourceFileName;
        Status = DraftBatchStatus.Created;
    }

    public void LinkToAiRequest(Guid aiRequestId) => AiRequestId = aiRequestId;

    public void MarkProcessing() => Status = DraftBatchStatus.Processing;

    public void MarkReadyForReview(int totalItems)
    {
        Check.Range(totalItems, nameof(totalItems), 0, int.MaxValue);
        TotalItems = totalItems;
        Status = totalItems == 0 ? DraftBatchStatus.Abandoned : DraftBatchStatus.ReadyForReview;
    }

    public void MarkFailed() => Status = DraftBatchStatus.Failed;

    public void RecordApproval(int approvedCount)
    {
        ApprovedItems += approvedCount;
        Status = ApprovedItems >= TotalItems
            ? DraftBatchStatus.FullyApproved
            : DraftBatchStatus.PartiallyApproved;
    }

    public void Abandon() => Status = DraftBatchStatus.Abandoned;
}
