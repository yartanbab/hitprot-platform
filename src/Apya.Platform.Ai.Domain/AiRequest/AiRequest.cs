using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai;

public class AiRequest : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public AiRequestStatus Status { get; private set; }

    public string ProviderName { get; private set; } = null!;

    public string RequestType { get; private set; } = null!;

    public Guid? CorrelationId { get; private set; }

    public string? ErrorMessage { get; private set; }

    public int TokensUsed { get; private set; }

    public TimeSpan? Duration { get; private set; }

    public ICollection<AiDecisionTrace> Traces { get; private set; } = new List<AiDecisionTrace>();

    protected AiRequest() { }

    public AiRequest(
        Guid id,
        string providerName,
        string requestType,
        Guid? correlationId = null,
        Guid? tenantId = null) : base(id)
    {
        ProviderName = Check.NotNullOrWhiteSpace(providerName, nameof(providerName));
        RequestType = Check.NotNullOrWhiteSpace(requestType, nameof(requestType));
        CorrelationId = correlationId;
        TenantId = tenantId;
        Status = AiRequestStatus.Pending;
    }

    public void MarkProcessing()
    {
        Status = AiRequestStatus.Processing;
    }

    public void MarkCompleted(int tokensUsed, TimeSpan duration)
    {
        Status = AiRequestStatus.Completed;
        TokensUsed = tokensUsed;
        Duration = duration;
    }

    public void MarkFailed(string errorMessage)
    {
        Status = AiRequestStatus.Failed;
        ErrorMessage = errorMessage?.Length > 2000
            ? errorMessage.Substring(0, 2000)
            : errorMessage;
    }

    public void AddTrace(AiDecisionTrace trace)
    {
        Traces.Add(trace);
    }
}
