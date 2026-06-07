using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// Raised on every <c>AiEvaluation</c> status transition so the Web layer can push live updates
/// over SignalR (mirrors the existing <c>DraftBatchStatusChangedEto</c> contract) and the workflow
/// engine can react when an evaluation completes.
/// </summary>
[EventName("apya.ai.evaluation.status-changed.v1")]
public class AiEvaluationStatusChangedEto
{
    public Guid EvaluationId { get; set; }
    public Guid? TenantId { get; set; }
    public Guid? UserId { get; set; }
    public Guid DocumentId { get; set; }
    public Guid ResponseId { get; set; }
    public AiEvaluationStatus NewStatus { get; set; }

    /// <summary>Parsed headline score, when the result was completed and schema-valid.</summary>
    public int? Score { get; set; }
    public string? RiskLevel { get; set; }
    public string? Decision { get; set; }
    public string? ErrorMessage { get; set; }
}
