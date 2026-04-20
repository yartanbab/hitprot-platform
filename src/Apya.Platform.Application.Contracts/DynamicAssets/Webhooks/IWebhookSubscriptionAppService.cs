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
}
