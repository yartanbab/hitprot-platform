using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Aggregate Root representing a webhook subscription tied to a specific document.
/// When a new response is submitted for the linked document,
/// a webhook notification is dispatched to the TargetUrl.
/// </summary>
public class WebhookSubscription : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>
    /// The document this subscription is monitoring for new responses.
    /// </summary>
    public Guid DocumentId { get; private set; }

    /// <summary>
    /// The external URL where webhook payloads will be POSTed.
    /// </summary>
    public string TargetUrl { get; private set; } = null!;

    /// <summary>
    /// Secret key used to generate HMAC-SHA256 signatures for payload verification.
    /// </summary>
    public string Secret { get; private set; } = null!;

    /// <summary>
    /// Whether this subscription is actively dispatching webhooks.
    /// </summary>
    public bool IsActive { get; private set; }

    protected WebhookSubscription()
    {
    }

    public WebhookSubscription(
        Guid id,
        Guid documentId,
        string targetUrl,
        string secret,
        bool isActive = true)
        : base(id)
    {
        DocumentId = documentId;
        TargetUrl = Check.NotNullOrWhiteSpace(targetUrl, nameof(targetUrl), maxLength: WebhookConsts.MaxTargetUrlLength);
        Secret = Check.NotNullOrWhiteSpace(secret, nameof(secret), maxLength: WebhookConsts.MaxSecretLength);
        IsActive = isActive;
    }

    public void Activate() => IsActive = true;

    public void Deactivate() => IsActive = false;

    public void SetTargetUrl(string targetUrl)
    {
        TargetUrl = Check.NotNullOrWhiteSpace(targetUrl, nameof(targetUrl), maxLength: WebhookConsts.MaxTargetUrlLength);
    }

    public void SetSecret(string secret)
    {
        Secret = Check.NotNullOrWhiteSpace(secret, nameof(secret), maxLength: WebhookConsts.MaxSecretLength);
    }
}
