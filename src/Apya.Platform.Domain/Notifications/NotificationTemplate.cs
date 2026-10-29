using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Notifications;

/// <summary>
/// Faz 4 · Hibe dışı bir bildirimin (Görev, Proje, Finans) host'un düzenlediği metni.
///
/// <para>Host katalog verisidir (<c>TenantId == null</c>): bütün kiracılar aynı metni alır. Hibe şablonundan
/// (<c>GrantNotificationTemplate</c>) ayrı tutulur: o tetikleyici, rol ve yükseltme taşıyor; burada yalnız
/// metin ve aç/kapa var (kullanıcı kararı 10-29).</para>
/// </summary>
public class NotificationTemplate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public const int MaxVariantLength = 32;
    public const int MaxSubjectLength = 200;

    /// <summary>Doldurulmuş gövde bildirim kaydına sığmalı (<see cref="NotificationConsts.MaxBodyLength"/>).</summary>
    public const int MaxBodyLength = 1000;

    public Guid? TenantId { get; set; }

    public NotificationType Type { get; private set; }

    /// <summary>Türün hâli (<see cref="NotificationTemplateDefinitions"/>); tek hâlli türde "Default".</summary>
    public string Variant { get; private set; } = NotificationTemplateDefinitions.Default;

    public string Subject { get; private set; } = string.Empty;

    public string Body { get; private set; } = string.Empty;

    /// <summary>Kapalıysa bu bildirim hiç üretilmez.</summary>
    public bool IsEnabled { get; private set; }

    protected NotificationTemplate() { }

    public NotificationTemplate(Guid id, NotificationType type, string variant, string subject, string body)
        : base(id)
    {
        Type = type;
        Variant = Check.NotNullOrWhiteSpace(variant, nameof(variant), MaxVariantLength);
        IsEnabled = true;
        SetText(subject, body);
    }

    public void SetText(string subject, string body)
    {
        Subject = Check.NotNullOrWhiteSpace(subject, nameof(subject), MaxSubjectLength);
        Body = Check.NotNullOrWhiteSpace(body, nameof(body), MaxBodyLength);
    }

    public void SetEnabled(bool enabled) => IsEnabled = enabled;
}
