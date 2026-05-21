using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Providers;

// ISingletonDependency: ChatClient wraps HttpClient internally — one instance per app avoids
// connection pool exhaustion that occurs when new ChatClient() is called per request.
public class OpenAiProvider : IAiProvider, ISingletonDependency
{
    public string Name => "openai";

    private readonly ChatClient _chatClient;
    private readonly ILogger<OpenAiProvider> _logger;

    public OpenAiProvider(IConfiguration configuration, ILogger<OpenAiProvider> logger)
    {
        _logger = logger;

        var apiKey = configuration["OpenAI:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException(
                "OpenAI:ApiKey yapılandırmada eksik. Uygulama başlatılamaz.");

        var model = configuration["OpenAI:Model"] ?? "gpt-4o-mini";
        _chatClient = new ChatClient(model, apiKey);
    }

    public async Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default)
    {
        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userMessage)
        };

        var stopwatch = Stopwatch.StartNew();
        var response = await _chatClient.CompleteChatAsync(messages, cancellationToken: cancellationToken);
        stopwatch.Stop();

        var content = response.Value.Content[0].Text;
        var usage = response.Value.Usage;

        return new AiCompletionResult
        {
            Response = content,
            InputTokens = usage?.InputTokenCount ?? 0,
            OutputTokens = usage?.OutputTokenCount ?? 0,
            Duration = stopwatch.Elapsed
        };
    }
}
