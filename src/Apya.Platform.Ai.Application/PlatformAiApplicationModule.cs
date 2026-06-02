using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenAI;
using Polly;
using Polly.CircuitBreaker;
using Polly.Retry;
using Volo.Abp.Application;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;
using Apya.Platform.Ai.Providers;

namespace Apya.Platform.Ai;

[DependsOn(
    typeof(PlatformAiDomainModule),
    typeof(PlatformAiApplicationContractsModule),
    typeof(PlatformApplicationModule),
    typeof(AbpDddApplicationModule),
    typeof(AbpAutoMapperModule)
)]
public class PlatformAiApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<PlatformAiApplicationModule>();
        });

        // S5b: OpenAIClient owns the HTTP connection pool, wrapped in Lazy so a missing OpenAI:ApiKey
        // no longer blocks startup (a Claude/Gemini/DeepSeek-only tenant can boot). The key is required
        // only when OpenAI is actually invoked (OpenAiProvider resolves _lazyClient.Value at call time).
        context.Services.AddSingleton(sp => new Lazy<OpenAIClient>(() =>
        {
            var apiKey = sp.GetRequiredService<IConfiguration>()["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new AiProviderException(
                    PlatformDomainErrorCodes.AiProviderNotConfigured,
                    "OpenAI API anahtarı yapılandırılmamış. OpenAI sağlayıcısı kullanılamaz.");
            return new OpenAIClient(apiKey);
        }));

        // ResiliencePipeline registered as singleton so the circuit breaker holds
        // app-wide state. AiGateway (transient) receives it via constructor injection,
        // enabling test doubles without a static field.
        // ARCH-041: Explicit type parameter ensures the DI container tracks this instance
        // for disposal (ResiliencePipeline<T> implements IDisposable; omitting the type
        // parameter still works but the disposal contract is ambiguous to the reader).
        context.Services.AddSingleton<ResiliencePipeline<AiCompletionResult>>(_ =>
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
                .Build());

        // Provider strategy (OCP): each concrete provider is registered as INamedAiProvider so
        // AiProviderResolver can enumerate them and pick by the tenant's preferred provider name.
        // AiGateway stays the sole IAiProvider facade (consumed by domain services).
        context.Services.AddHttpClient();
        context.Services.AddTransient<INamedAiProvider, OpenAiProvider>();
        context.Services.AddTransient<INamedAiProvider, ClaudeProvider>();
        context.Services.AddTransient<INamedAiProvider, GeminiProvider>();
        context.Services.AddTransient<INamedAiProvider, DeepSeekProvider>();
    }
}
