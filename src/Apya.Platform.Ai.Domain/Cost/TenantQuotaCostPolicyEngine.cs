using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;
using Apya.Platform.Ai.Tenants;

namespace Apya.Platform.Ai.Cost;

/// <summary>
/// Reads TenantAiSettings, enforces monthly token quota.
/// Tenants without settings get a permissive default (allow, but log).
/// </summary>
public class TenantQuotaCostPolicyEngine : ICostPolicyEngine, ITransientDependency
{
    private readonly IRepository<TenantAiSettings, Guid> _repository;
    private readonly IClock _clock;
    private readonly ILogger<TenantQuotaCostPolicyEngine> _logger;

    public TenantQuotaCostPolicyEngine(
        IRepository<TenantAiSettings, Guid> repository,
        IClock clock,
        ILogger<TenantQuotaCostPolicyEngine> logger)
    {
        _repository = repository;
        _clock = clock;
        _logger = logger;
    }

    public async Task<CostDecision> EvaluateAsync(
        Guid? tenantId,
        int estimatedTokens,
        CancellationToken cancellationToken = default)
    {
        var settings = await _repository.FirstOrDefaultAsync(x => x.TenantId == tenantId, cancellationToken);
        if (settings == null)
        {
            _logger.LogDebug("No TenantAiSettings for tenant {TenantId} — allow with default policy.", tenantId);
            return CostDecision.Allow(remaining: int.MaxValue);
        }

        if (!settings.IsEnabled)
            return CostDecision.Deny("AI features disabled for this tenant.", settings.RemainingTokens);

        if (!settings.CanConsume(estimatedTokens))
            return CostDecision.Deny(
                $"Monthly token quota exceeded. Estimated: {estimatedTokens}, Remaining: {settings.RemainingTokens}.",
                settings.RemainingTokens);

        return CostDecision.Allow(settings.RemainingTokens);
    }

    public async Task RecordUsageAsync(
        Guid? tenantId,
        int actualTokens,
        CancellationToken cancellationToken = default)
    {
        var settings = await _repository.FirstOrDefaultAsync(x => x.TenantId == tenantId, cancellationToken);
        if (settings == null) return;

        settings.RecordUsage(actualTokens, _clock.Now);
        await _repository.UpdateAsync(settings, cancellationToken: cancellationToken);
    }
}
