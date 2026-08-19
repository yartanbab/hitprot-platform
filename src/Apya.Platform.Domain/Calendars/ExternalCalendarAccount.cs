using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Calendars;

/// <summary>
/// Kullanıcının Google, Outlook gibi dış takvim hesaplarını ve OAuth token’larını tutar.
/// </summary>
public class ExternalCalendarAccount : FullAuditedAggregateRoot<Guid>
{
    public Guid UserId { get; set; }
    public CalendarProviderType Provider { get; set; }
    public string ExternalEmail { get; set; } = string.Empty;
    
    // Güvenlik: Token'lar veritabanında şifreli (encrypted) saklanmalıdır.
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime? TokenExpiryTime { get; set; }
    
    // Otomatik senkronizasyon açık mı?
    public bool IsSyncEnabled { get; set; }
    
    // Dış servis tarafındaki Sync Token veya Resource ID (webhook takibi için)
    public string ExternalSyncToken { get; set; } = string.Empty;
    public DateTime? LastSyncTime { get; set; }

    /// <summary>
    /// Bu hesaba HANGİ kaynak türlerinin yazılacağı — CalendarSourceType sayılarının
    /// virgülle ayrık listesi ("1,2,6"). BOŞ = yalnız görevler (eski davranış korunur,
    /// mevcut hesaplar sessizce her şeyi göndermeye başlamasın).
    /// <para>
    /// Ayrı tablo yerine CSV: bu değer üzerinden ilişkisel sorgu yapılmıyor, yalnız
    /// senkron sırasında okunup süzgeç olarak kullanılıyor.
    /// </para>
    /// </summary>
    public string SyncSources { get; set; } = string.Empty;

    /// <summary>
    /// Yalnız bu projelerin öğeleri gitsin — Guid'lerin virgülle ayrık listesi.
    /// BOŞ = proje süzgeci yok (tüm projeler).
    /// </summary>
    public string SyncProjectIds { get; set; } = string.Empty;

    /// <summary>Çakışma kuralı. Varsayılan: son değişen kazanır.</summary>
    public CalendarConflictRule ConflictRule { get; set; } = CalendarConflictRule.LastWriteWins;

    public ExternalCalendarAccount()
    {
        IsSyncEnabled = true;
        AccessToken = string.Empty;
        RefreshToken = string.Empty;
        ExternalSyncToken = string.Empty;
    }

    public ExternalCalendarAccount(Guid id, Guid userId, CalendarProviderType provider, string email) : base(id)
    {
        UserId = userId;
        Provider = provider;
        ExternalEmail = email;
        IsSyncEnabled = true;
    }
}
