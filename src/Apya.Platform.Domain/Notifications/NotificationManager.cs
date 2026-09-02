using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Emailing;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Notifications;

public class NotificationManager : DomainService
{
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IRepository<NotificationPreference, Guid> _preferenceRepository;
    private readonly IIdentityUserRepository _userRepository;
    private readonly IEmailSender _emailSender;
    private readonly ILocalEventBus _localEventBus;

    public NotificationManager(
        IRepository<Notification, Guid> notificationRepository,
        IRepository<NotificationPreference, Guid> preferenceRepository,
        IIdentityUserRepository userRepository,
        IEmailSender emailSender,
        ILocalEventBus localEventBus)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _userRepository = userRepository;
        _emailSender = emailSender;
        _localEventBus = localEventBus;
    }

    /// <summary>
    /// Bildirimi hem veritabanına kaydeder hem de anlık SignalR bildirimi için event fırlatır.
    /// Kategori, aciliyet ve gruplama davranışı <see cref="NotificationTypeRegistry"/>'den gelir;
    /// <paramref name="severity"/> verilirse türün varsayılanını ezer.
    /// </summary>
    public async Task PublishAsync(
        Guid userId,
        string title,
        string body,
        NotificationType type,
        string? entityType = null,
        Guid? entityId = null,
        NotificationSeverity? severity = null,
        Guid? actorUserId = null,
        string? actorName = null)
    {
        var info = NotificationTypeRegistry.Get(type);

        // 0. Kullanıcı bu kategoriyi sessize aldıysa hiç kayıt açma.
        //    Zorunlu türler bunun dışındadır: kaçırılması hak kaybına yol açar
        //    (kurum kararı + itiraz süresi). E-posta yine tercihe bağlıdır —
        //    zorunluluk bildirimin görünmesini garanti eder, kanal seçmez.
        var preference = await GetPreferenceAsync(userId, info.Category);
        if (!preference.InApp && !info.Mandatory)
            return;

        var effectiveSeverity = severity ?? info.DefaultSeverity;
        var groupKey = NotificationTypeRegistry.BuildGroupKey(type, entityType, entityId);

        // 1. Aynı kayda ait okunmamış bildirim varsa yeni satır açma — sayacı artır.
        //    (Bir göreve gelen her yorum ayrı satır olduğunda liste hızla okunamaz hale geliyordu.)
        if (groupKey != null)
        {
            var existing = await _notificationRepository.FirstOrDefaultAsync(
                n => n.UserId == userId && !n.IsRead && n.GroupKey == groupKey);

            if (existing != null)
            {
                existing.Repeat(title, body, actorUserId, actorName);
                await _notificationRepository.UpdateAsync(existing);
                await PublishCreatedEventAsync(userId, title, body, entityType, entityId, type);
                await TrySendCriticalEmailAsync(userId, preference.Email, effectiveSeverity, title, body);
                return;
            }
        }

        // 2. Yeni bildirim
        var notification = new Notification(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            userId,
            type,
            title,
            body,
            entityType,
            entityId,
            severity,
            groupKey,
            actorUserId,
            actorName
        );

        await _notificationRepository.InsertAsync(notification);

        await PublishCreatedEventAsync(userId, title, body, entityType, entityId, type);
        await TrySendCriticalEmailAsync(userId, preference.Email, effectiveSeverity, title, body);
    }

    /// <summary>
    /// Kullanıcı bu kategoriden e-posta istiyor mu? Bildirimi kendi kanalından
    /// gönderen üreticiler (bkz. hibe bildirim şablonları) tercihi burada sorar —
    /// aynı varsayılan mantığı ikinci kez yazmasınlar diye açıldı.
    /// </summary>
    public async Task<bool> IsEmailEnabledAsync(Guid userId, NotificationCategory category)
        => (await GetPreferenceAsync(userId, category)).Email;

    /// <summary>
    /// Kullanıcının bu kategorideki etkin kanal tercihi. Kayıt yoksa varsayılan
    /// döner — tercih tablosu yalnızca sapmaları tutar.
    /// </summary>
    private async Task<(bool InApp, bool Email)> GetPreferenceAsync(Guid userId, NotificationCategory category)
    {
        var stored = await _preferenceRepository.FirstOrDefaultAsync(
            p => p.UserId == userId && p.Category == category);

        return stored == null
            ? (NotificationPreferenceDefaults.InApp, NotificationPreferenceDefaults.Email)
            : (stored.InApp, stored.Email);
    }

    /// <summary>
    /// Kritik bildirimler beklemeye gelmez — kullanıcı bu kategoriden e-posta
    /// istiyorsa anında gönderilir. Geri kalanı günlük özete bırakılır
    /// (bkz. NotificationDigestWorker).
    /// </summary>
    private async Task TrySendCriticalEmailAsync(
        Guid userId, bool emailEnabled,
        NotificationSeverity severity, string title, string body)
    {
        if (!emailEnabled || severity < NotificationSeverity.Critical)
            return;

        try
        {
            var user = await _userRepository.FindAsync(userId);
            if (user == null || user.Email.IsNullOrWhiteSpace())
                return;

            await _emailSender.SendAsync(user.Email, title, body);
        }
        catch (Exception ex)
        {
            // E-posta altyapısı bildirim akışını kırmamalı: kayıt zaten atıldı,
            // kullanıcı uygulama içinde görecek.
            Logger.LogWarning(ex, "Kritik bildirim e-postası gönderilemedi. UserId: {UserId}", userId);
        }
    }

    // SignalR event fırlat (Web katmanı dinleyecek)
    private Task PublishCreatedEventAsync(
        Guid userId, string title, string body,
        string? entityType, Guid? entityId, NotificationType type)
        => _localEventBus.PublishAsync(new NotificationCreatedEto
        {
            TenantId   = CurrentTenant.Id,
            UserId     = userId,
            Title      = title,
            Body       = body,
            EntityType = entityType,
            EntityId   = entityId,
            Type       = type
        });
}

public class NotificationCreatedEto
{
    public Guid? TenantId { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public NotificationType Type { get; set; }
}

/// <summary>
/// Okunmamış bildirim sayısı değiştiğinde (okundu işaretlendi / silindi) yayınlanır.
/// Kullanıcının açık tüm oturumlarındaki zil rozetini eşitlemek için kullanılır.
/// </summary>
public class NotificationCountChangedEto
{
    public Guid? TenantId { get; set; }
    public Guid UserId { get; set; }
}
