using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Ai;

public class AiDecisionTrace : Entity<Guid>
{
    public Guid AiRequestId { get; private set; }
    public string SystemPrompt { get; private set; } = null!;
    public string UserMessage { get; private set; } = null!;
    public string Response { get; private set; } = null!;
    public DateTimeOffset PromptedAt { get; private set; }
    public DateTimeOffset? CompletedAt { get; private set; }
    public int? InputTokens { get; private set; }
    public int? OutputTokens { get; private set; }

    protected AiDecisionTrace() { }

    public AiDecisionTrace(
        Guid id,
        Guid aiRequestId,
        string systemPrompt,
        string userMessage,
        string response,
        DateTimeOffset promptedAt,
        DateTimeOffset completedAt,
        int? inputTokens = null,
        int? outputTokens = null) : base(id)
    {
        AiRequestId = aiRequestId;
        SystemPrompt = systemPrompt;
        UserMessage = userMessage;
        Response = response;
        PromptedAt = promptedAt;
        CompletedAt = completedAt;
        InputTokens = inputTokens;
        OutputTokens = outputTokens;
    }
}
