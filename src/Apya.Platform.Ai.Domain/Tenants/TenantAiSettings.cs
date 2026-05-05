using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Tenants;

/// <summary>
/// Per-tenant AI configuration: provider preferences and monthly quota.
/// One row per tenant (TenantId is unique).
/// </summary>
public class TenantAiSettings : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string PreferredProvider { get; private set; } = "openai";

    public string PreferredModel { get; private set; } = "gpt-4o-mini";

    public int MonthlyTokenQuota { get; private set; } = 100_000;

    public int TokensUsedThisMonth { get; private set; }

    public DateTime QuotaPeriodStart { get; private set; }

    public bool IsEnabled { get; private set; } = true;

    protected TenantAiSettings() { }

    public TenantAiSettings(Guid id, Guid? tenantId, DateTime quotaPeriodStart) : base(id)
    {
        TenantId = tenantId;
        QuotaPeriodStart = quotaPeriodStart;
    }

    public void SetProvider(string providerName, string model)
    {
        PreferredProvider = Check.NotNullOrWhiteSpace(providerName, nameof(providerName));
        PreferredModel = Check.NotNullOrWhiteSpace(model, nameof(model));
    }

    public void SetQuota(int monthlyTokenQuota)
    {
        Check.Range(monthlyTokenQuota, nameof(monthlyTokenQuota), 0, int.MaxValue);
        MonthlyTokenQuota = monthlyTokenQuota;
    }

    public void RecordUsage(int tokens, DateTime now)
    {
        if (now >= QuotaPeriodStart.AddMonths(1))
        {
            // Reset window
            TokensUsedThisMonth = 0;
            QuotaPeriodStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        }
        TokensUsedThisMonth += tokens;
    }

    public bool CanConsume(int estimatedTokens) =>
        IsEnabled && (TokensUsedThisMonth + estimatedTokens) <= MonthlyTokenQuota;

    public int RemainingTokens => Math.Max(0, MonthlyTokenQuota - TokensUsedThisMonth);

    public void Disable() => IsEnabled = false;
    public void Enable() => IsEnabled = true;
}
