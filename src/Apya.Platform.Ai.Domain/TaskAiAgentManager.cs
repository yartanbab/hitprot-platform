using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Apya.Platform.Ai.Context;
using Apya.Platform.Ai.Cost;
using Apya.Platform.Ai.Drafts;
using Apya.Platform.Ai.Prompts;

namespace Apya.Platform.Ai;

public class TaskAiAgentManager : DomainService
{
    private const string RequestType = "task-extraction";
    private const int MaxRepairAttempts = 1;
    private const int OutputTokenBuffer = 1000;
    private const int InputContextTokenBudget = 8000;
    private const double CharsPerToken = 4.0;

    private readonly IAiProvider _aiProvider;
    private readonly IAiResponseValidator _validator;
    private readonly IRepository<AiRequest, Guid> _aiRequestRepository;
    private readonly ICostPolicyEngine _costPolicyEngine;
    private readonly IAiContextBuilder _contextBuilder;

    private static readonly PromptTemplate Template = new(
        name: "task-extraction",
        version: "v1",
        systemPrompt:
            "Sen, yazılım ve iş dünyası uzmanı kıdemli bir Proje Yöneticisisin.\n" +
            "Sana bir proje yönergesi, toplantı dökümü veya gereksinim listesi içeren bir PDF metni vereceğim.\n" +
            "Görevin, bu metindeki süreçleri analiz edip çalışılabilir görevlere (tasks) bölmektir.\n\n" +
            "KURALLAR:\n" +
            "1. Sonuç KESİNLİKLE VE YALNIZCA JSON array formatında olmalıdır. JSON dışında hiçbir açıklama ekleme!\n" +
            "2. Metinde mantıklı bir görev bulamazsan boş liste '[]' dön.\n" +
            "3. Her bir görev yapısı:\n" +
            "[\n" +
            "  { \"Title\": \"Kısa başlık (Max 200 karakter)\", \"Description\": \"Detaylı tanım\", \"Priority\": 2, \"EstimatedHours\": 4.5 }\n" +
            "]\n" +
            "4. Çıktı dili tamamen Türkçe olmalıdır.",
        userMessageTemplate: "Aşağıdaki doküman metnini analiz et:\n\n{{text}}");

    public TaskAiAgentManager(
        IAiProvider aiProvider,
        IAiResponseValidator validator,
        IRepository<AiRequest, Guid> aiRequestRepository,
        ICostPolicyEngine costPolicyEngine,
        IAiContextBuilder contextBuilder)
    {
        _aiProvider = aiProvider;
        _validator = validator;
        _aiRequestRepository = aiRequestRepository;
        _costPolicyEngine = costPolicyEngine;
        _contextBuilder = contextBuilder;
    }

    public async Task<List<DraftTaskResult>> ExtractTasksFromTextAsync(
        string text,
        Guid? correlationId = null,
        CancellationToken cancellationToken = default)
    {
        var context = await _contextBuilder.BuildAsync(
            new AiContextRequest { PrimaryText = text ?? string.Empty, TokenBudget = InputContextTokenBudget },
            cancellationToken);

        if (context.Truncated)
        {
            Logger.LogWarning(
                "AI context truncated. OriginalChars: {OriginalChars}, BudgetTokens: {Budget}, EstimatedTokens: {Estimated}",
                text?.Length ?? 0, InputContextTokenBudget, context.EstimatedTokens);
        }

        var userMessage = Template.RenderUserMessage(new Dictionary<string, string> { ["text"] = context.Content });
        var estimatedTokens = context.EstimatedTokens
            + (int)(Template.SystemPrompt.Length / CharsPerToken)
            + OutputTokenBuffer;

        var costDecision = await _costPolicyEngine.EvaluateAsync(
            CurrentTenant.Id, estimatedTokens, cancellationToken);
        if (!costDecision.IsAllowed)
        {
            Logger.LogWarning(
                "AI quota denied. TenantId: {TenantId}, Estimated: {Estimated}, Remaining: {Remaining}, Reason: {Reason}",
                CurrentTenant.Id, estimatedTokens, costDecision.RemainingTokens, costDecision.DenialReason);
            throw new BusinessException(PlatformDomainErrorCodes.AiQuotaExceeded)
                .WithData("Reason", costDecision.DenialReason ?? string.Empty)
                .WithData("Remaining", costDecision.RemainingTokens);
        }

        var aiRequest = new AiRequest(
            GuidGenerator.Create(),
            providerName: _aiProvider.Name,
            requestType: RequestType,
            correlationId: correlationId,
            tenantId: CurrentTenant.Id);

        await _aiRequestRepository.InsertAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);
        aiRequest.MarkProcessing();
        await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);

        var totalInputTokens = 0;
        var totalOutputTokens = 0;
        var totalDuration = TimeSpan.Zero;

        try
        {
            var result = await CallProviderAndTraceAsync(
                aiRequest, Template.SystemPrompt, userMessage, cancellationToken);

            totalInputTokens += result.InputTokens;
            totalOutputTokens += result.OutputTokens;
            totalDuration += result.Duration;

            var response = result.Response;
            var validation = _validator.Validate(response);

            for (var attempt = 0; !validation.IsValid && attempt < MaxRepairAttempts; attempt++)
            {
                Logger.LogWarning(
                    "AI response validation failed. AiRequestId: {RequestId}, Attempt: {Attempt}, Errors: {Errors}",
                    aiRequest.Id, attempt + 1, string.Join("; ", validation.Errors));

                var repairMessage = userMessage + "\n\nDÜZELTME: " +
                    (validation.RepairHint ?? "Yanıtın geçerli JSON array değildi.");

                result = await CallProviderAndTraceAsync(
                    aiRequest, Template.SystemPrompt, repairMessage, cancellationToken);

                totalInputTokens += result.InputTokens;
                totalOutputTokens += result.OutputTokens;
                totalDuration += result.Duration;
                response = result.Response;

                validation = _validator.Validate(response);
            }

            if (!validation.IsValid)
            {
                var errorSummary = string.Join("; ", validation.Errors);
                aiRequest.MarkFailed("Validation failed: " + errorSummary);
                await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);
                Logger.LogError(
                    "AI response failed validation after {Max} repair attempts. AiRequestId: {RequestId}",
                    MaxRepairAttempts, aiRequest.Id);
                throw new AiProviderException(PlatformDomainErrorCodes.AiResponseInvalid, errorSummary);
            }

            var jsonContent = response.Trim();
            if (jsonContent.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                jsonContent = jsonContent.Substring(7);
                if (jsonContent.EndsWith("```"))
                    jsonContent = jsonContent.Substring(0, jsonContent.Length - 3);
                jsonContent = jsonContent.Trim();
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tasks = JsonSerializer.Deserialize<List<DraftTaskResult>>(jsonContent, options)
                ?? new List<DraftTaskResult>();

            aiRequest.MarkCompleted(totalInputTokens + totalOutputTokens, totalDuration);
            await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);

            Logger.LogInformation(
                "AI task extraction completed. AiRequestId: {RequestId}, Tasks: {Count}, Tokens: {Tokens}",
                aiRequest.Id, tasks.Count, totalInputTokens + totalOutputTokens);

            return tasks;
        }
        catch (AiProviderException)
        {
            throw;
        }
        catch (JsonException ex)
        {
            aiRequest.MarkFailed("JSON parse failed: " + ex.Message);
            await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);
            Logger.LogError(ex, "AI response JSON parse hatası. AiRequestId: {RequestId}", aiRequest.Id);
            throw new AiProviderException(
                PlatformDomainErrorCodes.AiResponseInvalid,
                "AI yanıtı JSON olarak çözümlenemedi.",
                ex);
        }
    }

    private async Task<AiCompletionResult> CallProviderAndTraceAsync(
        AiRequest aiRequest,
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken)
    {
        var promptedAt = DateTimeOffset.UtcNow;
        try
        {
            var result = await _aiProvider.CompleteAsync(systemPrompt, userMessage, cancellationToken);

            aiRequest.AddTrace(new AiDecisionTrace(
                GuidGenerator.Create(),
                aiRequestId: aiRequest.Id,
                systemPrompt: systemPrompt,
                userMessage: userMessage,
                response: result.Response,
                promptedAt: promptedAt,
                completedAt: DateTimeOffset.UtcNow,
                inputTokens: result.InputTokens,
                outputTokens: result.OutputTokens));

            await _costPolicyEngine.RecordUsageAsync(
                aiRequest.TenantId, result.InputTokens + result.OutputTokens, cancellationToken);

            return result;
        }
        catch (AiProviderException ex)
        {
            aiRequest.AddTrace(new AiDecisionTrace(
                GuidGenerator.Create(),
                aiRequestId: aiRequest.Id,
                systemPrompt: systemPrompt,
                userMessage: userMessage,
                response: "[error] " + ex.Message,
                promptedAt: promptedAt,
                completedAt: DateTimeOffset.UtcNow));
            aiRequest.MarkFailed(ex.Message);
            await _aiRequestRepository.UpdateAsync(aiRequest, autoSave: true, cancellationToken: cancellationToken);
            throw;
        }
    }
}
