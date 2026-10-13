using System;
using System.Security.Cryptography;
using System.Text;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Kullanıcının bildirim alabildiği bir cihaz / tarayıcı aboneliği.
///
/// <para>Adres (<see cref="Endpoint"/>) 450 karakteri aşabildiği için indekslenmez; tekillik
/// SHA-256 özeti (<see cref="EndpointHash"/>) üzerinden kurulur.</para>
/// </summary>
public class NotificationDevice : FullAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid UserId { get; private set; }

    public NotificationDevicePlatform Platform { get; private set; }

    public string Endpoint { get; private set; } = null!;

    public string EndpointHash { get; private set; } = null!;

    /// <summary>Web push şifreleme anahtarları; mobilde boş.</summary>
    public string? P256dh { get; private set; }
    public string? Auth { get; private set; }

    public string? DeviceLabel { get; private set; }
    public string? UserAgent { get; private set; }

    public bool IsActive { get; private set; }

    public DateTime? LastSeenAt { get; private set; }
    public DateTime? LastSuccessAt { get; private set; }
    public DateTime? LastFailureAt { get; private set; }
    public int FailureCount { get; private set; }
    public string? DeactivationReason { get; private set; }

    protected NotificationDevice() { }

    public NotificationDevice(
        Guid id,
        Guid? tenantId,
        Guid userId,
        NotificationDevicePlatform platform,
        string endpoint,
        string? p256dh,
        string? auth,
        string? userAgent,
        DateTime now) : base(id)
    {
        TenantId = tenantId;
        UserId = userId;
        Platform = platform;
        Endpoint = Check.NotNullOrWhiteSpace(endpoint, nameof(endpoint), NotificationDeviceConsts.MaxEndpointLength);
        EndpointHash = HashEndpoint(endpoint);
        Refresh(p256dh, auth, userAgent, now);
    }

    /// <summary>Aynı adres yeniden kaydedildi (anahtar yenilemesi / yeniden abonelik): cihaz canlanır.</summary>
    public void Refresh(string? p256dh, string? auth, string? userAgent, DateTime now)
    {
        P256dh = Check.Length(p256dh, nameof(p256dh), NotificationDeviceConsts.MaxKeyLength);
        Auth = Check.Length(auth, nameof(auth), NotificationDeviceConsts.MaxKeyLength);
        UserAgent = Truncate(userAgent, NotificationDeviceConsts.MaxUserAgentLength);
        DeviceLabel = Truncate(DescribeUserAgent(userAgent), NotificationDeviceConsts.MaxDeviceLabelLength);
        IsActive = true;
        FailureCount = 0;
        DeactivationReason = null;
        LastSeenAt = now;
    }

    public void MarkSuccess(DateTime now)
    {
        LastSuccessAt = now;
        FailureCount = 0;
    }

    public void MarkFailure(DateTime now)
    {
        LastFailureAt = now;
        FailureCount++;
    }

    public void Deactivate(string reason)
    {
        IsActive = false;
        DeactivationReason = Truncate(reason, NotificationDeviceConsts.MaxDeactivationReasonLength);
    }

    public static string HashEndpoint(string endpoint)
        => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(endpoint))).ToLowerInvariant();

    private static string? Truncate(string? value, int max)
        => string.IsNullOrWhiteSpace(value) ? null : value.Length <= max ? value : value[..max];

    /// <summary>"Chrome · Windows" gibi kısa etiket; tanınmayan parça atlanır.</summary>
    public static string? DescribeUserAgent(string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            return null;
        }

        // Sıra önemli: Edge ve Opera "Chrome", Chrome "Safari" içerir.
        var browser = userAgent.Contains("Edg/") ? "Edge"
            : userAgent.Contains("OPR/") ? "Opera"
            : userAgent.Contains("Firefox/") ? "Firefox"
            : userAgent.Contains("Chrome/") ? "Chrome"
            : userAgent.Contains("Safari/") ? "Safari"
            : null;

        var os = userAgent.Contains("Windows") ? "Windows"
            : userAgent.Contains("Android") ? "Android"
            : userAgent.Contains("iPhone") || userAgent.Contains("iPad") ? "iOS"
            : userAgent.Contains("Mac OS X") ? "macOS"
            : userAgent.Contains("Linux") ? "Linux"
            : null;

        return browser != null && os != null ? browser + " · " + os : browser ?? os;
    }
}
