using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Calendars;

/// <summary>
/// Dışarıdan eklenen bir .ics bağlantısı (Apple Takvim, Notion, resmî tatiller…).
/// <para>
/// TEK YÖNLÜDÜR: etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime
/// YAZILMAZ. Çift yönlü senkron için Google/Outlook hesabı bağlanır.
/// </para>
/// </summary>
public class IcalSubscription : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid UserId { get; private set; }

    /// <summary>Kaynak .ics adresi. Yalnız http/https kabul edilir (SSRF koruması AppService'te).</summary>
    public string Url { get; private set; } = string.Empty;

    public string DisplayName { get; private set; } = string.Empty;

    /// <summary>Takvimde gösterilecek renk — tokens.css aksan paletinden bir anahtar.</summary>
    public string Color { get; private set; } = "accent";

    /// <summary>Yenileme sıklığı (dakika): 15, 60, 360 veya 1440.</summary>
    public int RefreshMinutes { get; private set; } = 60;

    public bool IsEnabled { get; private set; } = true;

    public DateTime? LastFetchedAt { get; private set; }

    /// <summary>Son çekimde bulunan etkinlik sayısı — "38 etkinlik" satırı.</summary>
    public int LastEventCount { get; private set; }

    /// <summary>Null = sağlıklı. Doluysa satır hata durumuna düşer (404, zaman aşımı…).</summary>
    public string? LastError { get; private set; }

    protected IcalSubscription() { }

    public IcalSubscription(Guid id, Guid? tenantId, Guid userId, string url, string displayName, string color, int refreshMinutes) : base(id)
    {
        TenantId = tenantId;
        UserId   = userId;
        Update(url, displayName, color, refreshMinutes);
    }

    public void Update(string url, string displayName, string color, int refreshMinutes)
    {
        Url            = url?.Trim() ?? string.Empty;
        DisplayName    = string.IsNullOrWhiteSpace(displayName) ? "Takvim" : displayName.Trim();
        Color          = string.IsNullOrWhiteSpace(color) ? "accent" : color.Trim();
        RefreshMinutes = NormalizeRefresh(refreshMinutes);
    }

    public void SetEnabled(bool enabled) => IsEnabled = enabled;

    public void MarkFetched(DateTime now, int eventCount)
    {
        LastFetchedAt  = now;
        LastEventCount = eventCount;
        LastError      = null;
    }

    public void MarkFailed(DateTime now, string error)
    {
        LastFetchedAt = now;
        LastError     = string.IsNullOrWhiteSpace(error) ? "Bağlantı yanıt vermiyor." : error.Trim();
    }

    /// <summary>Beyaz liste: form manipülasyonuyla dakikada bir çekim yaptırılamasın.</summary>
    private static int NormalizeRefresh(int minutes) => minutes switch
    {
        15 or 60 or 360 or 1440 => minutes,
        _ => 60
    };
}
