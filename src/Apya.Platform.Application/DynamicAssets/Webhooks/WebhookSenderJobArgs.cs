using System;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Argument DTO for the background job that sends a webhook to an external URL.
/// </summary>
public class WebhookSenderJobArgs
{
    public Guid SubscriptionId { get; set; }
    public Guid ResponseId { get; set; }
    public Guid DocumentId { get; set; }
    public string Answers { get; set; } = null!;
}
