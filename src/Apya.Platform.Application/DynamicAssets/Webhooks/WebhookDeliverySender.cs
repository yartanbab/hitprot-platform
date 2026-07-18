using System;
using System.Diagnostics;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Result of a single webhook HTTP delivery attempt.
/// </summary>
public class WebhookDeliveryResult
{
    public int ResponseCode { get; set; }
    public string? ResponseBody { get; set; }
    public bool IsSuccess { get; set; }
    public long ElapsedMilliseconds { get; set; }
}

/// <summary>
/// Signs and sends a single webhook HTTP delivery attempt. Shared by
/// <see cref="WebhookSenderJob"/> (automatic dispatch, with retry/backoff around it)
/// and manual delivery resends (single attempt, no retry).
/// </summary>
public class WebhookDeliverySender : ITransientDependency
{
    private readonly IHttpClientFactory _httpClientFactory;

    public WebhookDeliverySender(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<WebhookDeliveryResult> SendAsync(string targetUrl, string secret, string payload)
    {
        var signature = ComputeHmacSha256(payload, secret);

        var stopwatch = Stopwatch.StartNew();

        using var client = _httpClientFactory.CreateClient("WebhookClient");
        using var request = new HttpRequestMessage(HttpMethod.Post, targetUrl);

        request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
        request.Headers.Add(WebhookConsts.SignatureHeaderName, signature);

        using var httpResponse = await client.SendAsync(request);

        stopwatch.Stop();

        var responseBody = await httpResponse.Content.ReadAsStringAsync();
        if (responseBody.Length > WebhookConsts.MaxResponseBodyLength)
        {
            responseBody = responseBody[..WebhookConsts.MaxResponseBodyLength];
        }

        return new WebhookDeliveryResult
        {
            ResponseCode = (int)httpResponse.StatusCode,
            ResponseBody = responseBody,
            IsSuccess = httpResponse.IsSuccessStatusCode,
            ElapsedMilliseconds = stopwatch.ElapsedMilliseconds
        };
    }

    /// <summary>
    /// Computes an HMAC-SHA256 hash of the payload using the provided secret key.
    /// The resulting hex string is used as the X-Apya-Signature header value.
    /// </summary>
    public static string ComputeHmacSha256(string payload, string secret)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secret);
        var payloadBytes = Encoding.UTF8.GetBytes(payload);

        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(payloadBytes);

        return Convert.ToHexStringLower(hashBytes);
    }
}
