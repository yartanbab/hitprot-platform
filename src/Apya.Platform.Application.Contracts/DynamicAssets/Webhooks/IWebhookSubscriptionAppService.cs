using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Apya.Platform.DynamicAssets.Webhooks.Dtos;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Application service interface for managing webhook subscriptions.
/// Allows tenant admins to create, update, and monitor webhooks for their documents.
/// </summary>
public interface IWebhookSubscriptionAppService : IApplicationService
{
    Task<WebhookSubscriptionDto> CreateAsync(CreateUpdateWebhookSubscriptionDto input);
    Task<WebhookSubscriptionDto> UpdateAsync(Guid id, CreateUpdateWebhookSubscriptionDto input);
    Task<WebhookSubscriptionDto> GetAsync(Guid id);
    Task<PagedResultDto<WebhookSubscriptionDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task DeleteAsync(Guid id);
    Task<List<WebhookDeliveryLogDto>> GetDeliveryLogsAsync(Guid subscriptionId);

    /// <summary>
    /// Re-sends a previously logged delivery's exact payload as a single, immediate
    /// attempt (no retry/backoff — this is a deliberate manual action). Appends a new
    /// delivery log row instead of mutating the original.
    /// </summary>
    Task<WebhookDeliveryLogDto> ResendDeliveryAsync(Guid deliveryLogId);

    /// <summary>
    /// Generates a new random secret for the subscription and returns it in plaintext.
    /// This is the only moment the secret is ever exposed to the client — it is never
    /// returned by any other endpoint before or after this call.
    /// </summary>
    Task<RegenerateWebhookSecretResultDto> RegenerateSecretAsync(Guid id);
}
