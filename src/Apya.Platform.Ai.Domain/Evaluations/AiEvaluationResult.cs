using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// The stored outcome of an <see cref="AiEvaluation"/> (1:1 child). Holds the raw AI JSON plus the
/// schema-driven parsed headline fields (score / risk / decision / summary) used by dashboards and
/// workflow rules. <see cref="IsSchemaValid"/> records whether the output validated against the
/// prompt's JSON schema.
/// </summary>
public class AiEvaluationResult : Entity<Guid>
{
    public Guid EvaluationId { get; private set; }

    public string RawJson { get; private set; } = null!;

    public bool IsSchemaValid { get; private set; }

    public int? Score { get; private set; }

    public string? RiskLevel { get; private set; }

    public string? Decision { get; private set; }

    public string? Summary { get; private set; }

    public int TokensUsed { get; private set; }

    public int DurationMs { get; private set; }

    protected AiEvaluationResult() { }

    public AiEvaluationResult(
        Guid id,
        Guid evaluationId,
        string rawJson,
        bool isSchemaValid,
        int tokensUsed,
        int durationMs,
        int? score = null,
        string? riskLevel = null,
        string? decision = null,
        string? summary = null) : base(id)
    {
        EvaluationId = evaluationId;
        RawJson = rawJson ?? string.Empty;
        IsSchemaValid = isSchemaValid;
        TokensUsed = tokensUsed;
        DurationMs = durationMs;
        Score = score;
        RiskLevel = Truncate(riskLevel, EvaluationConsts.MaxRiskLevelLength);
        Decision = Truncate(decision, EvaluationConsts.MaxDecisionLength);
        Summary = summary;
    }

    private static string? Truncate(string? value, int max) =>
        value != null && value.Length > max ? value.Substring(0, max) : value;
}
