using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
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
    private readonly IDataFilter<ISoftDelete> _softDeleteFilter;

    public NotificationManager(
        IRepository<Notification, Guid> notificationRepository,
        IRepository<NotificationPreference, Guid> preferenceRepository,
        IIdentityUserRepository userRepository,
        IEmailSender emailSender,
        ILocalEventBus localEventBus,
        IDataFilter<ISoftDelete> softDeleteFilter)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _userRepository = userRepository;
        _emailSender = emailSender;
        _localEventBus = localEventBus;
        _softDeleteFilter = softDeleteFilter;
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
                await PublishCreatedEventAsync(existing);
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

        await PublishCreatedEventAsync(notification);
        await TrySendCriticalEmailAsync(userId, preference.Email, effectiveSeverity, title, body);
    }

    /// <summary>
    /// Aynı durum için ÖMÜRDE BİR KEZ bildirim üretir.
    ///
    /// <para>Eşik uyarılarının ihtiyacı budur: "kalem %90'ı geçti" koşulu bir kez
    /// doğru olduktan sonra kalıcı olarak doğru kalır; her worker turunda
    /// <see cref="PublishAsync"/> çağrılsaydı kullanıcı aynı uyarıyı her gün alırdı.</para>
    ///
    /// <para>Hafıza ayrı bir tabloda değil, bildirimin KENDİSİNDE tutulur:
    /// <paramref name="onceKey"/> satırın <c>GroupKey</c>'ine yazılır ve varlığı
    /// sorgulanır. Arama okunmuşa ve SİLİNMİŞE de bakar — kullanıcının uyarıyı
    /// okuması ya da silmesi "bu durum bildirildi" gerçeğini değiştirmez; aksi
    /// halde bildirimi silen kullanıcı ertesi gün aynısını yeniden alırdı.</para>
    ///
    /// <para>Bilinen sınır: <see cref="NotificationCleanupWorker"/> satırı
    /// <see cref="NotificationConsts.RetentionDays"/> sonra kalıcı siler; koşul
    /// hâlâ doğruysa uyarı o zaman bir kez daha üretilir. Uzun projede yılda birkaç
    /// tekrar demektir ve hatırlatma değeri taşır.</para>
    /// </summary>
    /// <param name="onceKey">
    /// Durumun kimliği — ör. <c>"29:BudgetLine:{id}:90"</c>. Aynı kullanıcı ve aynı
    /// anahtar için ikinci kayıt açılmaz. Eşik değeri anahtarın parçasıdır: %90
    /// uyarısı %100 uyarısını engellemez.
    /// </param>
    /// <returns>Bildirim üretildiyse <c>true</c>; daha önce üretilmiş ya da kullanıcı
    /// kategoriyi sessize almışsa <c>false</c>.</returns>
    public async Task<bool> PublishOnceAsync(
        Guid userId,
        string onceKey,
        string title,
        string body,
        NotificationType type,
        string? entityType = null,
        Guid? entityId = null,
        NotificationSeverity? severity = null)
    {
        Check.NotNullOrWhiteSpace(onceKey, nameof(onceKey), NotificationConsts.MaxGroupKey);

        var info = NotificationTypeRegistry.Get(type);

        var preference = await GetPreferenceAsync(userId, info.Category);
        if (!preference.InApp && !info.Mandatory)
            return false;

        // Silinmiş satır da "gönderildi" sayılır; global filtre açık kalsaydı
        // kullanıcının sildiği uyarı her turda yeniden üretilirdi.
        Notification? alreadySent;
        using (_softDeleteFilter.Disable())
        {
            alreadySent = await _notificationRepository.FirstOrDefaultAsync(
                n => n.UserId == userId && n.GroupKey == onceKey);
        }

        if (alreadySent != null)
            return false;

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
            onceKey);

        await _notificationRepository.InsertAsync(notification);

        await PublishCreatedEventAsync(notification);
        await TrySendCriticalEmailAsync(
            userId, preference.Email, severity ?? info.DefaultSeverity, title, body);

        return true;
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
    /// istiyorsa hemen kuyruğa alınır. Geri kalanı günlük özete bırakılır
    /// (bkz. NotificationDigestWorker).
    ///
    /// <para><c>QueueAsync</c> (ABP arka plan işi, kalıcı <c>AbpBackgroundJobs</c>
    /// tablosu + yeniden deneme) kullanılıyor, <c>SendAsync</c> değil: doğrudan
    /// gönderim SMTP el sıkışmasını KULLANICININ İSTEĞİ İÇİNDE bekletiyordu —
    /// sunucu yavaşsa gideri kaydeden kişi bunu gecikme olarak görüyordu. Kuyruk
    /// ayrıca geçici SMTP hatalarını yeniden deniyor; eskiden ilk hata yutuluyordu.</para>
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

            await _emailSender.QueueAsync(user.Email, title, body);
        }
        catch (Exception ex)
        {
            // E-posta altyapısı bildirim akışını kırmamalı: kayıt zaten atıldı,
            // kullanıcı uygulama içinde görecek.
            Logger.LogWarning(ex, "Kritik bildirim e-postası kuyruğa alınamadı. UserId: {UserId}", userId);
        }
    }

    // SignalR event fırlat (Web katmanı dinleyecek).
    // Kaydın kendisi geçiriliyor: gruplanan bildirimde metin Repeat() ile
    // tazelendiği için çağıranın elindeki title/body değil, satırın son hâli
    // yayınlanmalı.
    private Task PublishCreatedEventAsync(Notification notification)
        => _localEventBus.PublishAsync(new NotificationCreatedEto
        {
            Id         = notification.Id,
            TenantId   = notification.TenantId,
            UserId     = notification.UserId,
            Title      = notification.Title,
            Body       = notification.Body,
            EntityType = notification.EntityType,
            EntityId   = notification.EntityId,
            Type       = notification.Type,
            Severity   = notification.Severity
        });
}

public class NotificationCreatedEto
{
    /// <summary>
    /// Bildirim satırının kimliği. İstemci bunu alınca "okundu" işaretlemesi ve
    /// masaüstü bildiriminin tekilleştirme etiketi için ek sorgu atmak zorunda kalmaz.
    /// </summary>
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public NotificationType Type { get; set; }

    /// <summary>
    /// Türün varsayılanı değil, satıra YAZILAN aciliyet — üretici ezmiş olabilir.
    /// İstemci toast biçimini ve masaüstü bildiriminin ısrarlılığını buna göre seçer.
    /// </summary>
    public NotificationSeverity Severity { get; set; }
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
