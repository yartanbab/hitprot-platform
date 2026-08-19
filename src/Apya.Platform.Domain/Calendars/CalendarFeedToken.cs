using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Calendars;

/// <summary>
/// Kullanıcının salt-okunur iCal abonelik bağlantısının anahtarı
/// (<c>/ical/u/{token}.ics</c>).
/// <para>
/// GÜVENLİK: Bağlantının kendisi paroladır — onu bilen takvimi okur. Bu yüzden
/// token DÜZ SAKLANMAZ: aramada <see cref="TokenHash"/> (SHA-256) kullanılır,
/// kullanıcıya tekrar göstermek için ise şifreli kopya tutulur
/// (<see cref="CalendarTokenProtector"/> ile — OAuth token'larıyla aynı koruma).
/// Sızdığından şüphelenilirse yeniden üretilir ve eski bağlantı anında ölür.
/// </para>
/// </summary>
public class CalendarFeedToken : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid UserId { get; private set; }

    /// <summary>Aramada kullanılan SHA-256 özeti (Base64). Benzersiz indeksli.</summary>
    public string TokenHash { get; private set; } = string.Empty;

    /// <summary>Şifreli token — kullanıcıya bağlantıyı yeniden gösterebilmek için.</summary>
    public string TokenProtected { get; private set; } = string.Empty;

    public DateTime? LastAccessedAt { get; private set; }

    protected CalendarFeedToken() { }

    public CalendarFeedToken(Guid id, Guid? tenantId, Guid userId, string tokenHash, string tokenProtected) : base(id)
    {
        TenantId       = tenantId;
        UserId         = userId;
        TokenHash      = tokenHash;
        TokenProtected = tokenProtected;
    }

    /// <summary>Token'ı yeniden üretir — eski bağlantı bu andan sonra çalışmaz.</summary>
    public void Rotate(string tokenHash, string tokenProtected)
    {
        TokenHash      = tokenHash;
        TokenProtected = tokenProtected;
        LastAccessedAt = null;
    }

    public void MarkAccessed(DateTime now) => LastAccessedAt = now;
}
