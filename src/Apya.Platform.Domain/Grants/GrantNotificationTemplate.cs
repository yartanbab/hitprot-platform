using System;
using System.Linq;
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

    /// <summary>
    /// Şablonun gittiği rol. Rol şablonu varsa o roldeki alıcı için Genel şablonun yerine geçer
    /// (metin, kanal ve açık/kapalı durumu dahil).
    /// </summary>
    public GrantNotificationAudience Audience { get; private set; }

    /// <summary>
    /// Yükseltme şablonu mu? Yükseltme, tetikleyicinin beklediği iş <see cref="AfterDays"/> gün içinde
    /// yapılmazsa gider; ilk bildirimin yerine geçmez. Genel kitle burada "işi bekleyen taraf" demektir.
    /// </summary>
    public bool IsEscalation { get; private set; }

    /// <summary>Yükseltme kaç gün beklendikten sonra gider. Yalnız yükseltme şablonunda dolu.</summary>
    public int? AfterDays { get; private set; }

    public const int MaxAfterDays = 90;

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
        bool email = false,
        GrantNotificationAudience audience = GrantNotificationAudience.Genel)
        : base(id)
    {
        if (audience != GrantNotificationAudience.Genel
            && !GrantNotificationTriggerRegistry.AudiencesOf(trigger).Contains(audience))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateAudienceNotReached);
        }

        Trigger = trigger;
        Audience = audience;
        IsEnabled = true;
        SetChannels(inApp, email);
        SetText(subject, body);
    }

    /// <summary>
    /// Yükseltme şablonu. Yalnız beklenen işi olan tetikleyicide ve o işin yükselebileceği kitleye kurulur.
    /// </summary>
    public static GrantNotificationTemplate CreateEscalation(
        Guid id,
        GrantNotificationTrigger trigger,
        GrantNotificationAudience audience,
        int afterDays,
        string subject,
        string body,
        bool email = true)
    {
        if (!GrantNotificationTriggerRegistry.EscalationAudiencesOf(trigger).Contains(audience))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationEscalationNotAllowed);
        }

        var template = new GrantNotificationTemplate(id, trigger, subject, body, inApp: true, email: email)
        {
            Audience = audience,
            IsEscalation = true
        };
        template.SetAfterDays(afterDays);
        return template;
    }

    public void SetAfterDays(int afterDays)
    {
        if (!IsEscalation)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationEscalationNotAllowed);
        }

        if (afterDays < 1 || afterDays > MaxAfterDays)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationEscalationDaysInvalid)
                .WithData("Max", MaxAfterDays);
        }

        AfterDays = afterDays;
    }

    /// <summary>Bu şablonun metni, kanalları ve durumuyla başka bir role kopyası.</summary>
    public GrantNotificationTemplate CopyFor(Guid id, GrantNotificationAudience audience)
    {
        if (audience == GrantNotificationAudience.Genel || IsEscalation)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantNotificationTemplateAudienceNotReached);
        }

        return new GrantNotificationTemplate(id, Trigger, Subject, Body, InApp, Email, audience)
        {
            TenantId = TenantId,
            IsEnabled = IsEnabled
        };
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
