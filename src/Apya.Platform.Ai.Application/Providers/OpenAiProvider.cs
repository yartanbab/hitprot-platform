using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;

namespace Apya.Platform.Ai.Providers;

public class OpenAiProvider : IAiProvider
{
    public string Name => "openai";

    private readonly IConfiguration _configuration;
    private readonly ILogger<OpenAiProvider> _logger;

    public OpenAiProvider(IConfiguration configuration, ILogger<OpenAiProvider> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("OpenAI:ApiKey yapılandırmada bulunamadı.");
            throw new AiProviderException(
                PlatformDomainErrorCodes.AiProviderUnavailable,
                "OpenAI:ApiKey yapılandırmada bulunamadı.");
        }

        var model = _configuration["OpenAI:Model"] ?? "gpt-4o-mini";
        var chatClient = new ChatClient(model, apiKey);

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userMessage)
        };

        var stopwatch = Stopwatch.StartNew();
        var response = await chatClient.CompleteChatAsync(messages, cancellationToken: cancellationToken);
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
