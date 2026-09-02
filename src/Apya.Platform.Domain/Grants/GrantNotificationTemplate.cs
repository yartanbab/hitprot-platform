using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Bir hibe tetikleyicisinin metni ve kanalları.
///
/// <para>Host katalog verisidir (<c>TenantId == null</c>) — metni host yazar, bütün
/// kiracılar aynı metni alır. <see cref="IMultiTenant"/> uygulanır ki katalog
/// okumaları repo genelindeki kiracı filtresiyle aynı davranışı göstersin.</para>
///
/// <para>Alıcı kitlesi ŞABLONDA TUTULMAZ — tetikleyiciden türer (revizyon isteği
/// yükleyen kişiye, karar firmaya ve danışmana gider). Düzenlenebilir bir alan
/// olsaydı host'un seçtiği kitle ile kodun gerçekten yazdığı kitle sessizce
/// ayrışırdı.</para>
/// </summary>
public class GrantNotificationTemplate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public GrantNotificationTrigger Trigger { get; private set; }

    /// <summary>Kapalıysa tetikleyici hiç bildirim üretmez.</summary>
    public bool IsEnabled { get; private set; }

    /// <summary>Uygulama içi bildirim üretilsin mi.</summary>
    public bool InApp { get; private set; }

    /// <summary>E-posta gönderilsin mi. Kullanıcının kendi tercihi ayrıca geçerlidir.</summary>
    public bool Email { get; private set; }

    /// <summary>Bildirim başlığı ve e-posta konusu. Değişken taşıyabilir.</summary>
    public string Subject { get; private set; } = string.Empty;

    /// <summary>Gövde metni. Değişken taşıyabilir.</summary>
    public string Body { get; private set; } = string.Empty;

    protected GrantNotificationTemplate() { }

    public GrantNotificationTemplate(
        Guid id,
        GrantNotificationTrigger trigger,
        string subject,
        string body,
        bool inApp = true,
        bool email = false)
        : base(id)
    {
        Trigger = trigger;
        IsEnabled = true;
        SetChannels(inApp, email);
        SetText(subject, body);
    }

    public void SetText(string subject, string body)
    {
        Subject = Check.NotNullOrWhiteSpace(subject, nameof(subject), maxLength: 200);
        Body = Check.NotNullOrWhiteSpace(body, nameof(body), maxLength: 2000);
    }

    public void SetChannels(bool inApp, bool email)
    {
        if (!inApp && !email)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateNeedsChannel);
        }

        // Zorunlu tetikleyicide uygulama içi bildirim kapatılamaz: kararın kullanıcıya
        // ulaşması itiraz süresinin işlemesinin ön koşulu. Yalnız e-posta bırakmak
        // yetmez — kullanıcının e-posta tercihi kapalıysa karar hiç görünmezdi.
        if (!inApp && GrantNotificationTriggerRegistry.IsMandatory(Trigger))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateMandatory);
        }

        InApp = inApp;
        Email = email;
    }

    public void SetEnabled(bool enabled)
    {
        if (!enabled && GrantNotificationTriggerRegistry.IsMandatory(Trigger))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateMandatory);
        }

        IsEnabled = enabled;
    }
}
