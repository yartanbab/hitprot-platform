using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.DynamicAssets.Webhooks.Dtos;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Manages webhook subscriptions for tenant admins.
/// Provides CRUD operations and delivery log viewing.
/// </summary>
[Authorize]
public class WebhookSubscriptionAppService : PlatformAppService, IWebhookSubscriptionAppService
{
    private readonly IRepository<WebhookSubscription, Guid> _subscriptionRepository;
    private readonly IRepository<WebhookDeliveryLog, Guid> _deliveryLogRepository;
    private readonly ILogger<WebhookSubscriptionAppService> _logger;

    public WebhookSubscriptionAppService(
        IRepository<WebhookSubscription, Guid> subscriptionRepository,
        IRepository<WebhookDeliveryLog, Guid> deliveryLogRepository,
        ILogger<WebhookSubscriptionAppService> logger)
    {
        _subscriptionRepository = subscriptionRepository;
        _deliveryLogRepository = deliveryLogRepository;
        _logger = logger;
    }

    public async Task<WebhookSubscriptionDto> CreateAsync(CreateUpdateWebhookSubscriptionDto input)
    {
        var subscription = new WebhookSubscription(
            GuidGenerator.Create(),
            input.DocumentId,
            input.TargetUrl,
            input.Secret,
            input.IsActive
        );

        await _subscriptionRepository.InsertAsync(subscription, autoSave: true);

        _logger.LogInformation(
            "Webhook aboneliği oluşturuldu. SubscriptionId: {SubscriptionId}, DocumentId: {DocumentId}, TargetUrl: {TargetUrl}",
            subscription.Id, subscription.DocumentId, subscription.TargetUrl);

        return ObjectMapper.Map<WebhookSubscription, WebhookSubscriptionDto>(subscription);
    }

    public async Task<WebhookSubscriptionDto> UpdateAsync(Guid id, CreateUpdateWebhookSubscriptionDto input)
    {
        var subscription = await _subscriptionRepository.GetAsync(id);

        subscription.SetTargetUrl(input.TargetUrl);
        subscription.SetSecret(input.Secret);

        if (input.IsActive)
            subscription.Activate();
        else
            subscription.Deactivate();

        await _subscriptionRepository.UpdateAsync(subscription, autoSave: true);

        _logger.LogInformation(
            "Webhook aboneliği güncellendi. SubscriptionId: {SubscriptionId}",
            subscription.Id);

        return ObjectMapper.Map<WebhookSubscription, WebhookSubscriptionDto>(subscription);
    }

    public async Task<WebhookSubscriptionDto> GetAsync(Guid id)
    {
        var subscription = await _subscriptionRepository.GetAsync(id);
        return ObjectMapper.Map<WebhookSubscription, WebhookSubscriptionDto>(subscription);
    }

    public async Task<PagedResultDto<WebhookSubscriptionDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var totalCount = await _subscriptionRepository.GetCountAsync();

        var items = await _subscriptionRepository.GetPagedListAsync(
            input.SkipCount,
            input.MaxResultCount,
            input.Sorting ?? nameof(WebhookSubscription.CreationTime) + " DESC"
        );

        var dtos = ObjectMapper.Map<List<WebhookSubscription>, List<WebhookSubscriptionDto>>(items);

        return new PagedResultDto<WebhookSubscriptionDto>(totalCount, dtos);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _subscriptionRepository.DeleteAsync(id);

        _logger.LogInformation("Webhook aboneliği silindi. SubscriptionId: {SubscriptionId}", id);
    }

    public async Task<List<WebhookDeliveryLogDto>> GetDeliveryLogsAsync(Guid subscriptionId)
    {
        var logs = await _deliveryLogRepository.GetListAsync(
            l => l.SubscriptionId == subscriptionId
        );

        return ObjectMapper.Map<List<WebhookDeliveryLog>, List<WebhookDeliveryLogDto>>(
            logs.OrderByDescending(l => l.CreationTime).ToList()
        );
    }
}
