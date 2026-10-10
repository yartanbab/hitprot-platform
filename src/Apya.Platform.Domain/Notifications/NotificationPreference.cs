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

    /// <summary>Açıksa bu kategorinin KRİTİK bildirimleri anında e-postayla gönderilir.</summary>
    public bool Email { get; set; }

    /// <summary>
    /// Açıksa bu kategorinin kritik olmayan bildirimleri günlük özet e-postasına girer.
    /// NTF-09: eskiden ikisi tek bayraktı; kritik uyarıyı isteyen özeti de almak zorundaydı.
    /// </summary>
    public bool Digest { get; set; }

    protected NotificationPreference() { }

    public NotificationPreference(
        Guid id,
        Guid? tenantId,
        Guid userId,
        NotificationCategory category,
        bool inApp,
        bool email,
        bool? digest = null)
        : base(id)
    {
        TenantId = tenantId;
        UserId   = userId;
        Category = category;
        InApp    = inApp;
        Email    = email;
        // Belirtilmezse e-postayı izler: bayrak ayrılmadan önceki davranış.
        Digest   = digest ?? email;
    }

    public void Set(bool inApp, bool email, bool digest)
    {
        InApp = inApp;
        Email = email;
        Digest = digest;
    }
}

/// <summary>
/// Tercih kaydı olmayan kullanıcı için geçerli davranış.
/// <para>
/// İki e-posta kanalı da varsayılan olarak KAPALI: açık gelseydi mevcut her kullanıcı, hiç
/// istemeden e-posta almaya başlardı. Kullanıcı hangi kategoriden ne istediğini kendi seçer.
/// </para>
/// </summary>
public static class NotificationPreferenceDefaults
{
    public const bool InApp = true;
    public const bool Email = false;
    public const bool Digest = false;
}
