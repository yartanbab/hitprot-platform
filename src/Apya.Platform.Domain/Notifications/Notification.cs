using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Notifications;

/// <summary>
/// Kullanıcıya gönderilen bir bildirimi temsil eder.
/// FullAuditedAggregateRoot: CreationTime, CreatorId, SoftDelete otomatik.
/// </summary>
public class Notification : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    // Bildirimin alıcısı
    public Guid UserId { get; set; }

    // Bildirim türü (görev atandı, yorum vb.)
    public NotificationType Type { get; set; }

    // Türden türetilen üst başlık — sorgu/filtre kolaylığı için denormalize edildi
    public NotificationCategory Category { get; set; }

    // Aciliyet: sıralama ve görsel vurgu
    public NotificationSeverity Severity { get; set; }

    // Aynı kayda ait tekrarlayan bildirimleri birleştiren anahtar (null = gruplanmaz)
    public string? GroupKey { get; set; }

    // Bu satırın kaç olayı temsil ettiği ("3 yeni yorum")
    public int OccurrenceCount { get; set; }

    // Gruptaki son olayın zamanı — listede sıralama bunun üzerinden yapılır
    public DateTime LastOccurredAt { get; set; }

    // Olayı tetikleyen kişi (worker kaynaklı bildirimlerde null)
    public Guid? ActorUserId { get; set; }
    public string? ActorName { get; set; }

    // Kısa başlık — navbar dropdown'da gösterilir
    public string Title { get; set; } = string.Empty;

    // Detay metin — bildirim geçmişi sayfasında gösterilir
    public string Body { get; set; } = string.Empty;

    // İlgili entity türü (Task, Project vb.) — derin link için
    public string? EntityType { get; set; }

    // İlgili entity ID'si — derin link için
    public Guid? EntityId { get; set; }

    // Okundu mu?
    public bool IsRead { get; set; }

    // Ne zaman okundu?
    public DateTime? ReadAt { get; set; }

    protected Notification() { }

    public Notification(
        Guid id,
        Guid? tenantId,
        Guid userId,
        NotificationType type,
        string title,
        string body,
        string? entityType = null,
        Guid? entityId = null,
        NotificationSeverity? severity = null,
        string? groupKey = null,
        Guid? actorUserId = null,
        string? actorName = null)
        : base(id)
    {
        var info = NotificationTypeRegistry.Get(type);

        TenantId        = tenantId;
        UserId          = userId;
        Type            = type;
        Category        = info.Category;
        Severity        = severity ?? info.DefaultSeverity;
        Title           = title;
        Body            = body;
        EntityType      = entityType;
        EntityId        = entityId;
        GroupKey        = groupKey;
        ActorUserId     = actorUserId;
        ActorName       = actorName;
        OccurrenceCount = 1;
        LastOccurredAt  = DateTime.UtcNow;
        IsRead          = false;
    }

    /// <summary>Bildirimi okundu olarak işaretler.</summary>
    public void MarkAsRead()
    {
        IsRead = true;
        ReadAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Aynı gruba yeni bir olay düştü: yeni satır açmak yerine bu satır tazelenir.
    /// Metin son olaya göre güncellenir, sayaç artar — "X görevine 3 yeni yorum".
    /// </summary>
    public void Repeat(string title, string body, Guid? actorUserId = null, string? actorName = null)
    {
        Title           = title;
        Body            = body;
        ActorUserId     = actorUserId;
        ActorName       = actorName;
        OccurrenceCount++;
        LastOccurredAt  = DateTime.UtcNow;
    }
}
