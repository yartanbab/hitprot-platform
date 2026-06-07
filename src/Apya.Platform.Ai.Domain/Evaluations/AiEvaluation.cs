using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// One AI evaluation of a single form submission by a single prompt version. Tracks the async
/// lifecycle (mirrors AiRequestStatus) and owns its 1:1 <see cref="AiEvaluationResult"/>. References
/// the form (DocumentId), the submission (ResponseId) and the exact prompt version by id, and links
/// to the underlying <c>AiRequest</c> for the provider-call audit trail.
/// </summary>
public class AiEvaluation : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public Guid DocumentId { get; private set; }

    public Guid ResponseId { get; private set; }

    public Guid PromptId { get; private set; }

    public Guid PromptVersionId { get; private set; }

    public Guid? AiRequestId { get; private set; }

    public AiEvaluationStatus Status { get; private set; }

    public string? ErrorMessage { get; private set; }

    public AiEvaluationResult? Result { get; private set; }

    protected AiEvaluation() { }

    public AiEvaluation(
        Guid id,
        Guid documentId,
        Guid responseId,
        Guid promptId,
        Guid promptVersionId,
        Guid? tenantId = null) : base(id)
    {
        DocumentId = documentId;
        ResponseId = responseId;
        PromptId = promptId;
        PromptVersionId = promptVersionId;
        TenantId = tenantId;
        Status = AiEvaluationStatus.Pending;
    }

    public void LinkAiRequest(Guid aiRequestId) => AiRequestId = aiRequestId;

    public void MarkProcessing() => Status = AiEvaluationStatus.Processing;

    public void MarkCompleted(AiEvaluationResult result)
    {
        Result = Check.NotNull(result, nameof(result));
        ErrorMessage = null;
        Status = AiEvaluationStatus.Completed;
    }

    public void MarkFailed(string? errorMessage)
    {
        ErrorMessage = errorMessage != null && errorMessage.Length > EvaluationConsts.MaxErrorMessageLength
            ? errorMessage.Substring(0, EvaluationConsts.MaxErrorMessageLength)
            : errorMessage;
        Status = AiEvaluationStatus.Failed;
    }
}
