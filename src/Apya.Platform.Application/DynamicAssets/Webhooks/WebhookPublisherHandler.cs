using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Volo.Abp.MultiTenancy;

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
    private readonly IRepository<AppDocument, Guid> _documentRepository;
    private readonly IBackgroundJobManager _backgroundJobManager;
    private readonly ILogger<WebhookPublisherHandler> _logger;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public WebhookPublisherHandler(
        IRepository<WebhookSubscription, Guid> subscriptionRepository,
        IRepository<AppDocument, Guid> documentRepository,
        IBackgroundJobManager backgroundJobManager,
        ILogger<WebhookPublisherHandler> logger,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _subscriptionRepository = subscriptionRepository;
        _documentRepository = documentRepository;
        _backgroundJobManager = backgroundJobManager;
        _logger = logger;
        _multiTenantFilter = multiTenantFilter;
    }

    public async Task HandleEventAsync(
        Volo.Abp.Domain.Entities.Events.EntityCreatedEventData<AppResponse> eventData)
    {
        var response = eventData.Entity;

        // Yanıt formun sahibinden başka bir kiracıda durabilir (host formunu dolduran kiracı) ve olay o
        // bağlamda işlenir; abonelik ise formun sahibine aittir. Abonelik açılırken formun sahipliği denetlenmediği için
        // yalnız formun kendi kiracısındaki abonelikler alınır; yoksa başka kiracı yanıtları dinleyebilirdi.
        List<WebhookSubscription> subscriptions;
        using (_multiTenantFilter.Disable())
        {
            var document = await _documentRepository.FindAsync(response.DocumentId);
            if (document is null)
            {
                return;
            }

            subscriptions = await _subscriptionRepository.GetListAsync(
                s => s.DocumentId == response.DocumentId && s.TenantId == document.TenantId && s.IsActive
            );
        }

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
                TenantId = subscription.TenantId,
                SubscriptionId = subscription.Id,
                ResponseId = response.Id,
                DocumentId = response.DocumentId,
                Answers = response.Answers
            });
        }
    }
}
