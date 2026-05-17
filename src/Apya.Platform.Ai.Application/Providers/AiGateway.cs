using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.CircuitBreaker;
using Polly.Retry;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Providers;

public class AiGateway : IAiProvider, ITransientDependency
{
    public string Name => $"gateway({_inner.Name})";

    private readonly IAiProvider _inner;
    private readonly ILogger<AiGateway> _logger;

    private static readonly ResiliencePipeline<AiCompletionResult> Pipeline =
        new ResiliencePipelineBuilder<AiCompletionResult>()
            .AddRetry(new RetryStrategyOptions<AiCompletionResult>
            {
                MaxRetryAttempts = 3,
                BackoffType = DelayBackoffType.Exponential,
                Delay = TimeSpan.FromSeconds(1),
                UseJitter = true
            })
            .AddCircuitBreaker(new CircuitBreakerStrategyOptions<AiCompletionResult>
            {
                FailureRatio = 0.5,
                SamplingDuration = TimeSpan.FromSeconds(30),
                MinimumThroughput = 5,
                BreakDuration = TimeSpan.FromSeconds(60)
            })
            .Build();

    public AiGateway(OpenAiProvider inner, ILogger<AiGateway> logger)
    {
        _inner = inner;
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return await Pipeline.ExecuteAsync(
                async ct => await _inner.CompleteAsync(systemPrompt, userMessage, ct),
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
