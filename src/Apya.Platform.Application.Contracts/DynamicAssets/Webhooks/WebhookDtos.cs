using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.DynamicAssets.Webhooks.Dtos;

/// <summary>
/// Output DTO for a WebhookSubscription record.
/// </summary>
public class WebhookSubscriptionDto : FullAuditedEntityDto<Guid>
{
    public Guid DocumentId { get; set; }
    public string TargetUrl { get; set; } = null!;
    public bool IsActive { get; set; }
    // Secret is intentionally excluded from output for security
}

/// <summary>
/// Input DTO for creating or updating a webhook subscription.
/// </summary>
public class CreateUpdateWebhookSubscriptionDto
{
    public Guid DocumentId { get; set; }
    public string TargetUrl { get; set; } = null!;
    public string Secret { get; set; } = null!;
    public bool IsActive { get; set; } = true;
}

/// <summary>
/// Output DTO for webhook delivery log entries (read-only).
/// </summary>
public class WebhookDeliveryLogDto : CreationAuditedEntityDto<Guid>
{
    public Guid SubscriptionId { get; set; }
    public string Payload { get; set; } = null!;
    public int ResponseCode { get; set; }
    public string? ResponseBody { get; set; }
    public int TryCount { get; set; }
    public bool IsSuccess { get; set; }
}
