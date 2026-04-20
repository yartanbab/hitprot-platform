using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Aggregate Root representing a single form submission/response to an <see cref="AppDocument"/>.
/// Answers are stored as a JSON string (mapped to JSONB in PostgreSQL).
/// Uses CreationAudited since responses are immutable after submission.
/// </summary>
public class AppResponse : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid DocumentId { get; private set; }

    /// <summary>
    /// Optional respondent identifier. Null for anonymous submissions.
    /// </summary>
    public Guid? RespondentId { get; private set; }

    /// <summary>
    /// JSON payload containing the form answers keyed by block ID.
    /// </summary>
    public string Answers { get; private set; } = null!;

    public Guid? TenantId { get; set; }

    /// <summary>
    /// Required by EF Core and ABP for deserialization.
    /// </summary>
    protected AppResponse()
    {
    }

    public AppResponse(
        Guid id,
        Guid documentId,
        string answers,
        Guid? respondentId = null)
        : base(id)
    {
        DocumentId = documentId;
        Answers = Check.NotNullOrWhiteSpace(answers, nameof(answers));
        RespondentId = respondentId;
    }
}
