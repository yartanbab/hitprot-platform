using System;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// Background-job payload that carries an already-persisted <c>AiEvaluation</c> (Pending) into the
/// async processing pipeline. Enqueued by <c>AiEvaluationTriggerHandler</c> (on form submission)
/// or manually by <c>AiEvaluationAppService</c>. Mirrors the existing <c>PdfTaskExtractionArgs</c>.
/// </summary>
[Serializable]
public class AiEvaluationJobArgs
{
    public Guid? TenantId { get; set; }

    public Guid? UserId { get; set; }

    /// <summary>The pre-created AiEvaluation aggregate to process.</summary>
    public Guid EvaluationId { get; set; }

    /// <summary>The submitted form response (AppResponse) being evaluated.</summary>
    public Guid ResponseId { get; set; }

    /// <summary>The form (AppDocument) the response belongs to.</summary>
    public Guid DocumentId { get; set; }

    /// <summary>The prompt to run.</summary>
    public Guid PromptId { get; set; }

    /// <summary>The exact prompt version resolved at enqueue time (immutability for audit).</summary>
    public Guid PromptVersionId { get; set; }
}
