using System;
using System.Threading;
using System.Threading.Tasks;

namespace Apya.Platform.Ai.Cost;

public interface ICostPolicyEngine
{
    Task<CostDecision> EvaluateAsync(
        Guid? tenantId,
        int estimatedTokens,
        CancellationToken cancellationToken = default);

    Task RecordUsageAsync(
        Guid? tenantId,
        int actualTokens,
        CancellationToken cancellationToken = default);
}

public class CostDecision
{
    public bool IsAllowed { get; init; }
    public string? DenialReason { get; init; }
    public int RemainingTokens { get; init; }

    public static CostDecision Allow(int remaining) =>
        new() { IsAllowed = true, RemainingTokens = remaining };

    public static CostDecision Deny(string reason, int remaining = 0) =>
        new() { IsAllowed = false, DenialReason = reason, RemainingTokens = remaining };
}
