using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
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

        try
        {
            using var client = _httpClientFactory.CreateClient("WebhookClient");
            using var request = new HttpRequestMessage(HttpMethod.Post, subscription.TargetUrl);

            request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
            request.Headers.Add(WebhookConsts.SignatureHeaderName, signature);

            using var httpResponse = await client.SendAsync(request);

            responseCode = (int)httpResponse.StatusCode;
            responseBody = await httpResponse.Content.ReadAsStringAsync();

            // Truncate response body for storage
            if (responseBody?.Length > WebhookConsts.MaxResponseBodyLength)
            {
                responseBody = responseBody[..WebhookConsts.MaxResponseBodyLength];
            }

            isSuccess = httpResponse.IsSuccessStatusCode;

            _logger.LogInformation(
                "Webhook gönderildi. SubscriptionId: {SubscriptionId}, StatusCode: {StatusCode}, Success: {IsSuccess}",
                subscription.Id, responseCode, isSuccess);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Webhook gönderimi sırasında hata oluştu. SubscriptionId: {SubscriptionId}, TargetUrl: {TargetUrl}",
                subscription.Id, subscription.TargetUrl);

            responseBody = ex.Message;
        }

        // Log the delivery attempt
        var deliveryLog = new WebhookDeliveryLog(
            _guidGenerator.Create(),
            subscription.Id,
            payload,
            responseCode,
            responseBody,
            tryCount: 1,
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
