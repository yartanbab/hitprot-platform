using System;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Apya.Platform.Ai.Providers;

/// <summary>
/// DeepSeek provider (OpenAI-compatible chat/completions). Credentials/model come from the tenant's
/// <c>AiProviderConfig</c>. Registered as <see cref="INamedAiProvider"/> in the module.
/// </summary>
public class DeepSeekProvider : INamedAiProvider
{
    public string Name => "deepseek";

    private const string Endpoint = "https://api.deepseek.com/chat/completions";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IAiProviderCredentialStore _credentials;
    private readonly ILogger<DeepSeekProvider> _logger;

    public DeepSeekProvider(
        IHttpClientFactory httpClientFactory,
        IAiProviderCredentialStore credentials,
        ILogger<DeepSeekProvider> logger)
    {
        _httpClientFactory = httpClientFactory;
        _credentials = credentials;
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(string systemPrompt, string userMessage, CancellationToken cancellationToken = default)
    {
        var creds = await _credentials.ResolveAsync(AiProviderType.DeepSeek, cancellationToken)
            ?? throw new AiProviderException(PlatformDomainErrorCodes.AiProviderNotConfigured, "DeepSeek için API anahtarı yapılandırılmamış.");

        var http = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, Endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", creds.ApiKey);
        request.Content = JsonContent.Create(new
        {
            model = creds.Model,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userMessage }
            }
        });

        var stopwatch = Stopwatch.StartNew();
        var response = await http.SendAsync(request, cancellationToken);
        stopwatch.Stop();

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("DeepSeek API hata {Status}: {Body}", (int)response.StatusCode, body);
            throw new AiProviderException(PlatformDomainErrorCodes.AiProviderUnavailable, "DeepSeek API çağrısı başarısız oldu.");
        }

        using var doc = JsonDocument.Parse(body);
        var root = doc.RootElement;
        var text = root.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? string.Empty;

        var inputTokens = 0;
        var outputTokens = 0;
        if (root.TryGetProperty("usage", out var usage))
        {
            if (usage.TryGetProperty("prompt_tokens", out var pt)) inputTokens = pt.GetInt32();
            if (usage.TryGetProperty("completion_tokens", out var ct)) outputTokens = ct.GetInt32();
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
