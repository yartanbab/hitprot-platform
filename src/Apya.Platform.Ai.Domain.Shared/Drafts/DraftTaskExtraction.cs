using System;
using Apya.Platform.Tasks;

namespace Apya.Platform.Ai.Drafts;

public class PdfTaskExtractionArgs
{
    public Guid? TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid ImportBatchId { get; set; }
    public string FileBlobName { get; set; } = null!;
}

public class DraftTaskResult
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; }
    public double EstimatedHours { get; set; }
}
