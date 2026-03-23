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
        Guid? entityId = null)
        : base(id)
    {
        TenantId   = tenantId;
        UserId     = userId;
        Type       = type;
        Title      = title;
        Body       = body;
        EntityType = entityType;
        EntityId   = entityId;
        IsRead     = false;
    }

    /// <summary>Bildirimi okundu olarak işaretler.</summary>
    public void MarkAsRead()
    {
        IsRead = true;
        ReadAt = DateTime.UtcNow;
    }
}
