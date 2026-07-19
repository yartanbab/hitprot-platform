using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Polly;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Background job that delivers a webhook payload to the subscription's target URL.
/// Computes an HMAC-SHA256 signature using the subscription's secret,
/// attaches it as <c>X-Apya-Signature</c> header, and logs the delivery result.
/// </summary>
public class WebhookSenderJob : AsyncBackgroundJob<WebhookSenderJobArgs>, ITransientDependency
{
    private readonly IRepository<WebhookSubscription, Guid> _subscriptionRepository;
    private readonly IRepository<WebhookDeliveryLog, Guid> _deliveryLogRepository;
    private readonly WebhookDeliverySender _deliverySender;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<WebhookSenderJob> _logger;

    public WebhookSenderJob(
        IRepository<WebhookSubscription, Guid> subscriptionRepository,
        IRepository<WebhookDeliveryLog, Guid> deliveryLogRepository,
        WebhookDeliverySender deliverySender,
        IGuidGenerator guidGenerator,
        ILogger<WebhookSenderJob> logger)
    {
        _subscriptionRepository = subscriptionRepository;
        _deliveryLogRepository = deliveryLogRepository;
        _deliverySender = deliverySender;
        _guidGenerator = guidGenerator;
        _logger = logger;
    }

    public override async Task ExecuteAsync(WebhookSenderJobArgs args)
    {
        var subscription = await _subscriptionRepository.FindAsync(args.SubscriptionId);

        if (subscription is null || !subscription.IsActive)
        {
            _logger.LogWarning(
                "Webhook aboneliği bulunamadı veya pasif. SubscriptionId: {SubscriptionId}",
                args.SubscriptionId);
            return;
        }

        // Build the JSON payload
        var payload = System.Text.Json.JsonSerializer.Serialize(new
        {
            @event = "response.created",
            documentId = args.DocumentId,
            responseId = args.ResponseId,
            answers = args.Answers,
            timestamp = DateTime.UtcNow
        });

        int responseCode = 0;
        string? responseBody = null;
        bool isSuccess = false;
        long? elapsedMilliseconds = null;
        int tryCount = 1;

        // GAP-008: Üstel Geri Çekilme (Exponential Backoff) ile Retry Stratejisi
        var retryPolicy = Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(
                retryCount: 3, // Maksimum 3 kez tekrar dene
                sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)), // 2, 4, 8 saniye bekle
                onRetry: (exception, timeSpan, attempt, context) =>
                {
                    tryCount = attempt + 1;
                    _logger.LogWarning(
                        exception,
                        "Webhook isteği başarısız oldu. Hedef: {TargetUrl}. {Delay}sn sonra yeniden denenecek. (Deneme: {Attempt}/3)",
                        subscription.TargetUrl, timeSpan.TotalSeconds, attempt);
                });

        try
        {
            await retryPolicy.ExecuteAsync(async () =>
            {
                var result = await _deliverySender.SendAsync(subscription.TargetUrl, subscription.Secret, payload);

                responseCode = result.ResponseCode;
                responseBody = result.ResponseBody;
                isSuccess = result.IsSuccess;
                elapsedMilliseconds = result.ElapsedMilliseconds;

                // Polly'nin 500 hatalarında da tekrar denemesi için HTTP seviyesi hata fırlatılır
                if (!isSuccess)
                {
                    throw new InvalidOperationException($"Webhook hedefi {responseCode} döndürdü.");
                }
            });

            _logger.LogInformation(
                "Webhook başarıyla gönderildi. SubscriptionId: {SubscriptionId}, StatusCode: {StatusCode}, Success: {IsSuccess}, Toplam Deneme: {TryCount}",
                subscription.Id, responseCode, isSuccess, tryCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Webhook maksimum deneme sonrasında da gönderilemedi. SubscriptionId: {SubscriptionId}, TargetUrl: {TargetUrl}",
                subscription.Id, subscription.TargetUrl);

            responseBody ??= ex.Message;
        }

        // Log the delivery attempt
        var deliveryLog = new WebhookDeliveryLog(
            _guidGenerator.Create(),
            subscription.Id,
            payload,
            responseCode,
            responseBody,
            tryCount,
            isSuccess,
            elapsedMilliseconds
        );

        await _deliveryLogRepository.InsertAsync(deliveryLog, autoSave: true);
    }
}
