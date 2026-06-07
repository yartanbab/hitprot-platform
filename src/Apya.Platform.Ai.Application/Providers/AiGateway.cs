using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.CircuitBreaker;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Providers;

/// <summary>
/// Resilient facade over the concrete <see cref="INamedAiProvider"/> strategies. Domain services
/// depend on <see cref="IAiProvider"/> and receive this gateway, which resolves the current tenant's
/// preferred provider and runs the call through the Polly retry + circuit-breaker pipeline.
/// This is the sole <see cref="IAiProvider"/> registration (concrete providers expose
/// <see cref="INamedAiProvider"/>), so consumers are never ambiguous.
/// </summary>
public class AiGateway : IAiProvider, ITransientDependency
{
    public string Name => "ai-gateway";

    private readonly IAiProviderResolver _resolver;
    private readonly ResiliencePipeline<AiCompletionResult> _pipeline;
    private readonly ILogger<AiGateway> _logger;

    public AiGateway(
        IAiProviderResolver resolver,
        ResiliencePipeline<AiCompletionResult> pipeline,
        ILogger<AiGateway> logger)
    {
        _resolver = resolver;
        _pipeline = pipeline;
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default)
    {
        // Provider selection runs outside the resilience pipeline: a missing/misconfigured provider
        // is a configuration error (fail fast), not a transient fault worth retrying.
        var provider = await _resolver.ResolveForTenantAsync(cancellationToken);

        try
        {
            return await _pipeline.ExecuteAsync(
                async ct => await provider.CompleteAsync(systemPrompt, userMessage, ct),
                cancellationToken);
        }
        catch (BrokenCircuitException ex)
        {
            _logger.LogError(ex, "AI provider circuit açık — istek reddedildi.");
            throw new AiProviderException(
                PlatformDomainErrorCodes.AiProviderUnavailable,
                "AI sağlayıcı geçici olarak kullanılamıyor. Lütfen biraz sonra tekrar deneyin.",
                ex);
        }
        catch (AiProviderException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AI Gateway retry tüketildi.");
            throw new AiProviderException(
                PlatformDomainErrorCodes.AiProviderUnavailable,
                ex.Message,
                ex);
        }
    }
}
