namespace Apya.Platform.Notifications;

public static class NotificationDeviceConsts
{
    public const int MaxEndpointLength = 1024;
    public const int EndpointHashLength = 64;
    public const int MaxKeyLength = 256;
    public const int MaxDeviceLabelLength = 128;
    public const int MaxUserAgentLength = 512;
    public const int MaxDeactivationReasonLength = 128;
}

/// <summary>Cihazın bildirim aldığı kanal. Mobil değerler şimdiden kabul edilir (istemci yok).</summary>
public enum NotificationDevicePlatform
{
    WebPush = 1,
    Android = 2,
    iOS = 3,
}
