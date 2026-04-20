using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Local event handler that listens for new <see cref="AppResponse"/> creations.
/// When a response is submitted, it finds all active webhook subscriptions
/// for the associated document and enqueues a background job for each.
/// </summary>
public class WebhookPublisherHandler
    : ILocalEventHandler<Volo.Abp.Domain.Entities.Events.EntityCreatedEventData<AppResponse>>,
      ITransientDependency
{
    private readonly IRepository<WebhookSubscription, Guid> _subscriptionRepository;
    private readonly IBackgroundJobManager _backgroundJobManager;
    private readonly ILogger<WebhookPublisherHandler> _logger;

    public WebhookPublisherHandler(
        IRepository<WebhookSubscription, Guid> subscriptionRepository,
        IBackgroundJobManager backgroundJobManager,
        ILogger<WebhookPublisherHandler> logger)
    {
        _subscriptionRepository = subscriptionRepository;
        _backgroundJobManager = backgroundJobManager;
        _logger = logger;
    }

    public async Task HandleEventAsync(
        Volo.Abp.Domain.Entities.Events.EntityCreatedEventData<AppResponse> eventData)
    {
        var response = eventData.Entity;

        // Find all active subscriptions watching this document
        var subscriptions = await _subscriptionRepository.GetListAsync(
            s => s.DocumentId == response.DocumentId && s.IsActive
        );

        if (!subscriptions.Any())
        {
            return;
        }

        _logger.LogInformation(
            "Yeni yanıt için {Count} aktif webhook aboneliği bulundu. ResponseId: {ResponseId}, DocumentId: {DocumentId}",
            subscriptions.Count, response.Id, response.DocumentId);

        // Enqueue a background job for each subscription
        foreach (var subscription in subscriptions)
        {
            await _backgroundJobManager.EnqueueAsync(new WebhookSenderJobArgs
            {
                SubscriptionId = subscription.Id,
                ResponseId = response.Id,
                DocumentId = response.DocumentId,
                Answers = response.Answers
            });
        }
    }
}
