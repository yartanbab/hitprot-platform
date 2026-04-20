namespace Apya.Platform.DynamicAssets.Webhooks;

/// <summary>
/// Shared constants for the Webhook module.
/// </summary>
public static class WebhookConsts
{
    public const int MaxTargetUrlLength = 512;
    public const int MaxSecretLength = 256;
    public const int MaxResponseBodyLength = 4096;
    public const string SignatureHeaderName = "X-Apya-Signature";
}
