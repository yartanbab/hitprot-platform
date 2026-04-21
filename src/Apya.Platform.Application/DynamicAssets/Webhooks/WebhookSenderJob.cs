using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
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
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<WebhookSenderJob> _logger;

    public WebhookSenderJob(
        IRepository<WebhookSubscription, Guid> subscriptionRepository,
        IRepository<WebhookDeliveryLog, Guid> deliveryLogRepository,
        IHttpClientFactory httpClientFactory,
        IGuidGenerator guidGenerator,
        ILogger<WebhookSenderJob> logger)
    {
        _subscriptionRepository = subscriptionRepository;
        _deliveryLogRepository = deliveryLogRepository;
        _httpClientFactory = httpClientFactory;
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

        // Compute HMAC-SHA256 signature
        var signature = ComputeHmacSha256(payload, subscription.Secret);

        int responseCode = 0;
        string? responseBody = null;
        bool isSuccess = false;
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
                using var client = _httpClientFactory.CreateClient("WebhookClient");
                using var request = new HttpRequestMessage(HttpMethod.Post, subscription.TargetUrl);

                request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
                request.Headers.Add(WebhookConsts.SignatureHeaderName, signature);

                using var httpResponse = await client.SendAsync(request);

                responseCode = (int)httpResponse.StatusCode;
                responseBody = await httpResponse.Content.ReadAsStringAsync();

                if (responseBody?.Length > WebhookConsts.MaxResponseBodyLength)
                {
                    responseBody = responseBody[..WebhookConsts.MaxResponseBodyLength];
                }

                isSuccess = httpResponse.IsSuccessStatusCode;

                // Polly'nin 500 hatalarında da tekrar denemesi için HTTP seviyesi hata fırlatılır
                httpResponse.EnsureSuccessStatusCode(); 
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
            isSuccess
        );

        await _deliveryLogRepository.InsertAsync(deliveryLog, autoSave: true);
    }

    /// <summary>
    /// Computes an HMAC-SHA256 hash of the payload using the provided secret key.
    /// The resulting hex string is used as the X-Apya-Signature header value.
    /// </summary>
    private static string ComputeHmacSha256(string payload, string secret)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secret);
        var payloadBytes = Encoding.UTF8.GetBytes(payload);

        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(payloadBytes);

        return Convert.ToHexStringLower(hashBytes);
    }
}
