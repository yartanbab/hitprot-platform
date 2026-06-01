using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Apya.Platform.Ai.Context;
using Apya.Platform.Ai.Cost;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.DynamicAssets;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// Orchestrates a single form-submission evaluation (mirrors <c>TaskAiAgentManager</c>): builds the
/// context from the form answers, enforces the tenant token quota, calls the provider through the
/// resilient <see cref="IAiProvider"/> gateway, validates the output against the prompt's JSON schema
/// with a one-shot repair loop, parses the headline fields and persists an <see cref="AiEvaluationResult"/>.
/// </summary>
public class AiEvaluationManager : DomainService
{
    private const string RequestType = "form-evaluation";
    private const int MaxRepairAttempts = 1;
    private const int OutputTokenBuffer = 1000;
    private const int InputContextTokenBudget = 8000;
    private const double CharsPerToken = 4.0;

    private readonly IAiProvider _aiProvider;
    private readonly IRepository<AiRequest, Guid> _aiRequestRepository;
    private readonly ICostPolicyEngine _costPolicyEngine;
    private readonly IAiContextBuilder _contextBuilder;
    private readonly IPromptRepository _promptRepository;
    private readonly IRepository<AiEvaluation, Guid> _evaluationRepository;
    private readonly IRepository<AppResponse, Guid> _responseRepository;

    public AiEvaluationManager(
        IAiProvider aiProvider,
        IRepository<AiRequest, Guid> aiRequestRepository,
        ICostPolicyEngine costPolicyEngine,
        IAiContextBuilder contextBuilder,
        IPromptRepository promptRepository,
        IRepository<AiEvaluation, Guid> evaluationRepository,
        IRepository<AppResponse, Guid> responseRepository)
    {
        _aiProvider = aiProvider;
        _aiRequestRepository = aiRequestRepository;
        _costPolicyEngine = costPolicyEngine;
        _contextBuilder = contextBuilder;
        _promptRepository = promptRepository;
        _evaluationRepository = evaluationRepository;
        _responseRepository = responseRepository;
    }

    /// <summary>Processes a pre-created (Pending) evaluation and returns it with its result populated.</summary>
    public async Task<AiEvaluation> ProcessAsync(Guid evaluationId, CancellationToken cancellationToken = default)
    {
        var evaluation = await _evaluationRepository.GetAsync(evaluationId, cancellationToken: cancellationToken);

        var prompt = await _promptRepository.GetWithVersionsAsync(evaluation.PromptId, cancellationToken)
            ?? throw new BusinessException(PlatformDomainErrorCodes.PromptNoPublishedVersion)
                .WithData("PromptId", evaluation.PromptId);

        var version = prompt.Versions.FirstOrDefault(v => v.Id == evaluation.PromptVersionId)
            ?? throw new BusinessException(PlatformDomainErrorCodes.PromptVersionNotFound);

        var response = await _responseRepository.GetAsync(evaluation.ResponseId, cancellationToken: cancellationToken);

        var context = await _contextBuilder.BuildAsync(
            new AiContextRequest { PrimaryText = response.Answers ?? string.Empty, TokenBudget = InputContextTokenBudget },
            cancellationToken);

        var template = version.ToTemplate(prompt.Code);
        var userMessage = template.RenderUserMessage(new Dictionary<string, string> { ["answers"] = context.Content });

        var estimatedTokens = context.EstimatedTokens
            + (int)(template.SystemPrompt.Length / CharsPerToken)
            + OutputTokenBuffer;

        var costDecision = await _costPolicyEngine.EvaluateAsync(CurrentTenant.Id, estimatedTokens, cancellationToken);
        if (!costDecision.IsAllowed)
        {
            evaluation.MarkFailed("Kota aşıldı: " + (costDecision.DenialReason ?? string.Empty));
            await _evaluationRepository.UpdateAsync(evaluation, autoSave: true, cancellationToken: cancellationToken);
            throw new BusinessException(PlatformDomainErrorCodes.AiQuotaExceeded)
                .WithData("Reason", costDecision.DenialReason ?? string.Empty)
                .WithData("Remaining", costDecision.RemainingTokens);
        }

        var aiRequest = new AiRequest(
            GuidGenerator.Create(), _aiProvider.Name, RequestType,
            correlationId: evaluation.Id, tenantId: CurrentTenant.Id);
        await _aiRequestRepository.InsertAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);

        evaluation.LinkAiRequest(aiRequest.Id);
        evaluation.MarkProcessing();
        await _evaluationRepository.UpdateAsync(evaluation, autoSave: true, cancellationToken: cancellationToken);
        aiRequest.MarkProcessing();
        await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);

        var validator = new JsonSchemaResponseValidator(version.JsonSchema);
        var totalInput = 0;
        var totalOutput = 0;
        var totalDuration = TimeSpan.Zero;

        try
        {
            var result = await CallProviderAndTraceAsync(aiRequest, template.SystemPrompt, userMessage, cancellationToken);
            totalInput += result.InputTokens; totalOutput += result.OutputTokens; totalDuration += result.Duration;

            var aiText = result.Response;
            var validation = validator.Validate(aiText);

            for (var attempt = 0; !validation.IsValid && attempt < MaxRepairAttempts; attempt++)
            {
                Logger.LogWarning("AI evaluation validation failed (attempt {Attempt}). EvaluationId: {Id}", attempt + 1, evaluation.Id);
                var repairMessage = userMessage + "\n\nDÜZELTME: " +
                    (validation.RepairHint ?? "Yanıtın şemaya uygun bir JSON nesnesi değildi.");
                result = await CallProviderAndTraceAsync(aiRequest, template.SystemPrompt, repairMessage, cancellationToken);
                totalInput += result.InputTokens; totalOutput += result.OutputTokens; totalDuration += result.Duration;
                aiText = result.Response;
                validation = validator.Validate(aiText);
            }

            var rawJson = StripFences(aiText);
            var headline = validation.IsValid ? ParseHeadline(rawJson) : default;

            var evaluationResult = new AiEvaluationResult(
                GuidGenerator.Create(),
                evaluation.Id,
                rawJson,
                isSchemaValid: validation.IsValid,
                tokensUsed: totalInput + totalOutput,
                durationMs: (int)totalDuration.TotalMilliseconds,
                score: headline.Score,
                riskLevel: headline.RiskLevel,
                decision: headline.Decision,
                summary: headline.Summary);

            evaluation.MarkCompleted(evaluationResult);
            aiRequest.MarkCompleted(totalInput + totalOutput, totalDuration);
            await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);
            await _evaluationRepository.UpdateAsync(evaluation, autoSave: true, cancellationToken: cancellationToken);

            Logger.LogInformation(
                "AI evaluation completed. EvaluationId: {Id}, SchemaValid: {Valid}, Score: {Score}, Tokens: {Tokens}",
                evaluation.Id, validation.IsValid, headline.Score, totalInput + totalOutput);

            return evaluation;
        }
        catch (AiProviderException ex)
        {
            evaluation.MarkFailed(ex.Message);
            await _evaluationRepository.UpdateAsync(evaluation, autoSave: true, cancellationToken: cancellationToken);
            throw;
        }
    }

    private async Task<AiCompletionResult> CallProviderAndTraceAsync(
        AiRequest aiRequest, string systemPrompt, string userMessage, CancellationToken cancellationToken)
    {
        var promptedAt = DateTimeOffset.UtcNow;
        try
        {
            var result = await _aiProvider.CompleteAsync(systemPrompt, userMessage, cancellationToken);
            aiRequest.AddTrace(new AiDecisionTrace(
                GuidGenerator.Create(), aiRequest.Id, systemPrompt, userMessage, result.Response,
                promptedAt, DateTimeOffset.UtcNow, result.InputTokens, result.OutputTokens));
            await _costPolicyEngine.RecordUsageAsync(aiRequest.TenantId, result.InputTokens + result.OutputTokens, cancellationToken);
            return result;
        }
        catch (AiProviderException ex)
        {
            aiRequest.AddTrace(new AiDecisionTrace(
                GuidGenerator.Create(), aiRequest.Id, systemPrompt, userMessage, "[error] " + ex.Message,
                promptedAt, DateTimeOffset.UtcNow));
            aiRequest.MarkFailed(ex.Message);
            await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);
            throw;
        }
    }

    private static string StripFences(string value)
    {
        var s = value.Trim();
        if (s.StartsWith("```json", StringComparison.OrdinalIgnoreCase)) s = s.Substring(7);
        else if (s.StartsWith("```")) s = s.Substring(3);
        if (s.EndsWith("```")) s = s.Substring(0, s.Length - 3);
        return s.Trim();
    }

    private static (int? Score, string? RiskLevel, string? Decision, string? Summary) ParseHeadline(string json)
    {
        try
        {
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.ValueKind != JsonValueKind.Object)
                return (null, null, null, null);

            return (
                TryGetInt(doc.RootElement, "score"),
                TryGetString(doc.RootElement, "riskLevel"),
                TryGetString(doc.RootElement, "decision"),
                TryGetString(doc.RootElement, "summary"));
        }
        catch (JsonException)
        {
            return (null, null, null, null);
        }
    }

    private static JsonElement? FindProperty(JsonElement obj, string name)
    {
        foreach (var p in obj.EnumerateObject())
            if (string.Equals(p.Name, name, StringComparison.OrdinalIgnoreCase))
                return p.Value;
        return null;
    }

    private static int? TryGetInt(JsonElement obj, string name)
    {
        var v = FindProperty(obj, name);
        return v.HasValue && v.Value.ValueKind == JsonValueKind.Number && v.Value.TryGetInt32(out var i) ? i : null;
    }

    private static string? TryGetString(JsonElement obj, string name)
    {
        var v = FindProperty(obj, name);
        return v.HasValue && v.Value.ValueKind == JsonValueKind.String ? v.Value.GetString() : null;
    }
}
