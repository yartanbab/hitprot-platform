using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Ai.Tenants;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI;
using OpenAI.Chat;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Providers;

// INamedAiProvider strategy (Name="openai"); registered explicitly in PlatformAiApplicationModule so
// AiProviderResolver enumerates it. OpenAIClient (singleton) owns the HTTP connection pool;
// GetChatClient() creates a lightweight per-call wrapper to pick the tenant's preferred model.
public class OpenAiProvider : INamedAiProvider
{
    public string Name => "openai";

    private readonly OpenAIClient _openAIClient;
    private readonly IRepository<TenantAiSettings, Guid> _settingsRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly string _defaultModel;
    private readonly ILogger<OpenAiProvider> _logger;

    public OpenAiProvider(
        OpenAIClient openAIClient,
        IRepository<TenantAiSettings, Guid> settingsRepository,
        ICurrentTenant currentTenant,
        IConfiguration configuration,
        ILogger<OpenAiProvider> logger)
    {
        _openAIClient = openAIClient;
        _settingsRepository = settingsRepository;
        _currentTenant = currentTenant;
        _defaultModel = configuration["OpenAI:Model"] ?? "gpt-4o-mini";
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default)
    {
        var model = await ResolveModelAsync();
        var chatClient = _openAIClient.GetChatClient(model);

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

    private async Task<string> ResolveModelAsync()
    {
        var settings = await _settingsRepository.FindAsync(s => s.TenantId == _currentTenant.Id);
        if (settings != null && !string.IsNullOrWhiteSpace(settings.PreferredModel))
        {
            _logger.LogDebug("Tenant {TenantId} için AI model: {Model}", _currentTenant.Id, settings.PreferredModel);
            return settings.PreferredModel;
        }

        return _defaultModel;
    }
}
