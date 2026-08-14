using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Notifications;

/// <summary>
/// Bir kullanıcının tek bir bildirim kategorisi için kanal tercihi.
/// <para>
/// Kayıt yoksa <see cref="NotificationPreferenceDefaults"/> geçerlidir — yani
/// tercih tablosu yalnızca varsayılandan sapmaları tutar, her kullanıcı için
/// baştan satır açılmaz.
/// </para>
/// </summary>
public class NotificationPreference : FullAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid UserId { get; set; }

    public NotificationCategory Category { get; set; }

    /// <summary>Kapalıysa bu kategoride bildirim hiç üretilmez.</summary>
    public bool InApp { get; set; }

    /// <summary>
    /// Açıksa bu kategoriden e-posta gönderilir: kritik olanlar anında,
    /// geri kalanı günlük özette.
    /// </summary>
    public bool Email { get; set; }

    protected NotificationPreference() { }

    public NotificationPreference(
        Guid id,
        Guid? tenantId,
        Guid userId,
        NotificationCategory category,
        bool inApp,
        bool email)
        : base(id)
    {
        TenantId = tenantId;
        UserId   = userId;
        Category = category;
        InApp    = inApp;
        Email    = email;
    }

    public void Set(bool inApp, bool email)
    {
        InApp = inApp;
        Email = email;
    }
}

/// <summary>
/// Tercih kaydı olmayan kullanıcı için geçerli davranış.
/// <para>
/// E-posta varsayılan olarak KAPALI: açık gelseydi mevcut her kullanıcı, hiç
/// istemeden günlük özet almaya başlardı. Kritik bildirimlerin anlık e-postası
/// da bu bayrağa bağlı — kullanıcı hangi kategoriden e-posta istediğini kendi seçer.
/// </para>
/// </summary>
public static class NotificationPreferenceDefaults
{
    public const bool InApp = true;
    public const bool Email = false;
}
