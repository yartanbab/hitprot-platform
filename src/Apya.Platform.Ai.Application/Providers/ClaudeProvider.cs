using System;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Apya.Platform.Ai.Providers;

/// <summary>
/// Anthropic Claude provider (Messages API). Credentials/model come from the tenant's
/// <c>AiProviderConfig</c>. Registered as <see cref="INamedAiProvider"/> in the module.
/// </summary>
public class ClaudeProvider : INamedAiProvider
{
    public string Name => "claude";

    private const string Endpoint = "https://api.anthropic.com/v1/messages";
    private const string AnthropicVersion = "2023-06-01";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IAiProviderCredentialStore _credentials;
    private readonly ILogger<ClaudeProvider> _logger;

    public ClaudeProvider(
        IHttpClientFactory httpClientFactory,
        IAiProviderCredentialStore credentials,
        ILogger<ClaudeProvider> logger)
    {
        _httpClientFactory = httpClientFactory;
        _credentials = credentials;
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(string systemPrompt, string userMessage, CancellationToken cancellationToken = default)
    {
        var creds = await _credentials.ResolveAsync(AiProviderType.Claude, cancellationToken)
            ?? throw new AiProviderException(PlatformDomainErrorCodes.AiProviderNotConfigured, "Claude için API anahtarı yapılandırılmamış.");

        var http = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, Endpoint);
        request.Headers.Add("x-api-key", creds.ApiKey);
        request.Headers.Add("anthropic-version", AnthropicVersion);
        request.Content = JsonContent.Create(new
        {
            model = creds.Model,
            max_tokens = 4096,
            system = systemPrompt,
            messages = new[] { new { role = "user", content = userMessage } }
        });

        var stopwatch = Stopwatch.StartNew();
        var response = await http.SendAsync(request, cancellationToken);
        stopwatch.Stop();

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Claude API hata {Status}: {Body}", (int)response.StatusCode, body);
            throw new AiProviderException(PlatformDomainErrorCodes.AiProviderUnavailable, "Claude API çağrısı başarısız oldu.");
        }

        using var doc = JsonDocument.Parse(body);
        var root = doc.RootElement;
        var text = root.GetProperty("content")[0].GetProperty("text").GetString() ?? string.Empty;

        var inputTokens = 0;
        var outputTokens = 0;
        if (root.TryGetProperty("usage", out var usage))
        {
            if (usage.TryGetProperty("input_tokens", out var it)) inputTokens = it.GetInt32();
            if (usage.TryGetProperty("output_tokens", out var ot)) outputTokens = ot.GetInt32();
        }

        return new AiCompletionResult
        {
            Response = text,
            InputTokens = inputTokens,
            OutputTokens = outputTokens,
            Duration = stopwatch.Elapsed
        };
    }
}
