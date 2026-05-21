using System;
using Microsoft.Extensions.DependencyInjection;
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

        // OpenAiProvider is the inner concrete dependency — register explicitly.
        context.Services.AddTransient<OpenAiProvider>();

        // ResiliencePipeline registered as singleton so the circuit breaker holds
        // app-wide state. AiGateway (transient) receives it via constructor injection,
        // enabling test doubles without a static field.
        context.Services.AddSingleton(_ =>
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
