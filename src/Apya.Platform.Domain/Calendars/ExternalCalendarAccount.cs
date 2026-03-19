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
    public string ExternalEmail { get; set; }
    
    // Güvenlik: Token'lar veritabanında şifreli (encrypted) saklanmalıdır.
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime? TokenExpiryTime { get; set; }
    
    // Otomatik senkronizasyon açık mı?
    public bool IsSyncEnabled { get; set; }
    
    // Dış servis tarafındaki Sync Token veya Resource ID (webhook takibi için)
    public string ExternalSyncToken { get; set; }
    public DateTime? LastSyncTime { get; set; }

    public ExternalCalendarAccount()
    {
        IsSyncEnabled = true;
    }

    public ExternalCalendarAccount(Guid id, Guid userId, CalendarProviderType provider, string email) : base(id)
    {
        UserId = userId;
        Provider = provider;
        ExternalEmail = email;
        IsSyncEnabled = true;
    }
}
