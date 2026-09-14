using System;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Argument DTO for the background job that sends a webhook to an external URL.
/// </summary>
public class WebhookSenderJobArgs
{
    /// <summary>
    /// Tenant of the subscription. Background jobs run without a tenant, and the job record
    /// does not store one, so the job has to switch to it before reading the subscription.
    /// </summary>
    public Guid? TenantId { get; set; }

    public Guid SubscriptionId { get; set; }
    public Guid ResponseId { get; set; }
    public Guid DocumentId { get; set; }
    public string Answers { get; set; } = null!;
}
