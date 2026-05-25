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

        // OpenAIClient singleton owns the HTTP connection pool; OpenAiProvider (scoped) calls
        // GetChatClient(model) per request to pick the tenant's preferred model at runtime.
        context.Services.AddSingleton(sp =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var apiKey = config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException(
                    "OpenAI:ApiKey yapılandırmada eksik. Uygulama başlatılamaz.");
            return new OpenAIClient(apiKey);
        });

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
    }
}
