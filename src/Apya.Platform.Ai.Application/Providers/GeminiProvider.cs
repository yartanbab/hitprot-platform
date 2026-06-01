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
/// Google Gemini provider (generateContent). Credentials/model come from the tenant's
/// <c>AiProviderConfig</c>. Registered as <see cref="INamedAiProvider"/> in the module.
/// </summary>
public class GeminiProvider : INamedAiProvider
{
    public string Name => "gemini";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IAiProviderCredentialStore _credentials;
    private readonly ILogger<GeminiProvider> _logger;

    public GeminiProvider(
        IHttpClientFactory httpClientFactory,
        IAiProviderCredentialStore credentials,
        ILogger<GeminiProvider> logger)
    {
        _httpClientFactory = httpClientFactory;
        _credentials = credentials;
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(string systemPrompt, string userMessage, CancellationToken cancellationToken = default)
    {
        var creds = await _credentials.ResolveAsync(AiProviderType.Gemini, cancellationToken)
            ?? throw new AiProviderException(PlatformDomainErrorCodes.AiProviderNotConfigured, "Gemini için API anahtarı yapılandırılmamış.");

        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{creds.Model}:generateContent?key={Uri.EscapeDataString(creds.ApiKey)}";

        var http = _httpClientFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
        request.Content = JsonContent.Create(new
        {
            system_instruction = new { parts = new[] { new { text = systemPrompt } } },
            contents = new[] { new { role = "user", parts = new[] { new { text = userMessage } } } }
        });

        var stopwatch = Stopwatch.StartNew();
        var response = await http.SendAsync(request, cancellationToken);
        stopwatch.Stop();

        var body = await response.Content.ReadAsStringAsync(cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Gemini API hata {Status}: {Body}", (int)response.StatusCode, body);
            throw new AiProviderException(PlatformDomainErrorCodes.AiProviderUnavailable, "Gemini API çağrısı başarısız oldu.");
        }

        using var doc = JsonDocument.Parse(body);
        var root = doc.RootElement;

        var text = string.Empty;
        if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
        {
            var parts = candidates[0].GetProperty("content").GetProperty("parts");
            if (parts.GetArrayLength() > 0)
                text = parts[0].GetProperty("text").GetString() ?? string.Empty;
        }

        var inputTokens = 0;
        var outputTokens = 0;
        if (root.TryGetProperty("usageMetadata", out var usage))
        {
            if (usage.TryGetProperty("promptTokenCount", out var pt)) inputTokens = pt.GetInt32();
            if (usage.TryGetProperty("candidatesTokenCount", out var ct)) outputTokens = ct.GetInt32();
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
