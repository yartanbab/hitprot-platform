using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Immutable log entry recording the result of a webhook delivery attempt.
/// Each attempt generates a new record, enabling retry tracking and debugging.
/// </summary>
public class WebhookDeliveryLog : CreationAuditedEntity<Guid>
{
    public Guid SubscriptionId { get; private set; }

    /// <summary>
    /// The JSON payload that was sent to the target URL.
    /// </summary>
    public string Payload { get; private set; } = null!;

    /// <summary>
    /// HTTP status code returned by the target server (e.g., 200, 500, 0 for timeout).
    /// </summary>
    public int ResponseCode { get; private set; }

    /// <summary>
    /// Truncated response body from the target server (for debugging).
    /// </summary>
    public string? ResponseBody { get; private set; }

    /// <summary>
    /// The attempt number for this delivery (1-based).
    /// </summary>
    public int TryCount { get; private set; }

    public bool IsSuccess { get; private set; }

    protected WebhookDeliveryLog()
    {
    }

    public WebhookDeliveryLog(
        Guid id,
        Guid subscriptionId,
        string payload,
        int responseCode,
        string? responseBody,
        int tryCount,
        bool isSuccess)
        : base(id)
    {
        SubscriptionId = subscriptionId;
        Payload = payload;
        ResponseCode = responseCode;
        ResponseBody = responseBody;
        TryCount = tryCount;
        IsSuccess = isSuccess;
    }
}
