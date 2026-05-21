using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.CircuitBreaker;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Providers;

public class AiGateway : IAiProvider, ITransientDependency
{
    public string Name => $"gateway({_inner.Name})";

    private readonly IAiProvider _inner;
    private readonly ResiliencePipeline<AiCompletionResult> _pipeline;
    private readonly ILogger<AiGateway> _logger;

    public AiGateway(
        OpenAiProvider inner,
        ResiliencePipeline<AiCompletionResult> pipeline,
        ILogger<AiGateway> logger)
    {
        _inner = inner;
        _pipeline = pipeline;
        _logger = logger;
    }

    public async Task<AiCompletionResult> CompleteAsync(
        string systemPrompt,
        string userMessage,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return await _pipeline.ExecuteAsync(
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
