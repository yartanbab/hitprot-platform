using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 19b · Fikir daveti: danışman firmaları proje fikrini paylaşmaya çağırır. Host kaydıdır (TenantId null);
/// firmalar <see cref="Recipients"/> satırlarıdır.
///
/// <para>Bağlam <see cref="GrantCallId"/>: boş = çağrıdan bağımsız, yanıt Fikir Havuzu'na düşer · dolu = o çağrı
/// için, yanıt çağrıya ilgi talebi olarak Talepler'e düşer.</para>
///
/// <para>"Yanıtladı" SAKLANMAZ, hesaplanır (<see cref="GrantIdeaInvitationManager"/>): firma davetten sonra fikir
/// paylaştıysa ya da çağrıya ilgi bildirdiyse. Saklansaydı fikir paylaşan her uç davet kaydını bilmek zorunda kalırdı.</para>
/// </summary>
public class GrantIdeaInvitation : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid? GrantCallId { get; private set; }

    /// <summary>Danışmanın yazdığı davet metni — bildirimin gövdesine ve formun üstüne gider.</summary>
    public string Message { get; private set; } = null!;

    public GrantIdeaInvitationAudience Audience { get; private set; }

    /// <summary>Uygulama içi bildirim her zaman gider; e-posta gönderim başına seçilir.</summary>
    public bool SendEmail { get; private set; }

    /// <summary>null = hatırlatma yok. Yanıtlamayana bu kadar gün sonra bir kez hatırlatılır.</summary>
    public int? RemindAfterDays { get; private set; }

    public DateTime SentAt { get; private set; }

    public ICollection<GrantIdeaInvitationRecipient> Recipients { get; private set; } = new List<GrantIdeaInvitationRecipient>();

    protected GrantIdeaInvitation() { }

    public GrantIdeaInvitation(
        Guid id,
        Guid? grantCallId,
        string message,
        GrantIdeaInvitationAudience audience,
        bool sendEmail,
        int? remindAfterDays,
        DateTime sentAt)
        : base(id)
    {
        var trimmed = message?.Trim();
        if (string.IsNullOrEmpty(trimmed))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInvitationMessageRequired);
        }
        if (remindAfterDays is < GrantIdeaInvitationConsts.MinRemindAfterDays or > GrantIdeaInvitationConsts.MaxRemindAfterDays)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInvitationReminderInvalid);
        }

        GrantCallId = grantCallId;
        Message = Check.Length(trimmed, nameof(message), GrantIdeaInvitationConsts.MaxMessageLength)!;
        Audience = audience;
        SendEmail = sendEmail;
        RemindAfterDays = remindAfterDays;
        SentAt = sentAt;
    }

    /// <summary>Aynı firma iki kez eklenmez: toplu seçimde tekrar gelse de tek bildirim.</summary>
    public GrantIdeaInvitationRecipient AddRecipient(Guid recipientId, Guid firmTenantId)
    {
        var existing = Recipients.FirstOrDefault(r => r.FirmTenantId == firmTenantId);
        if (existing != null)
        {
            return existing;
        }

        var recipient = new GrantIdeaInvitationRecipient(recipientId, Id, firmTenantId);
        Recipients.Add(recipient);
        return recipient;
    }

    public DateTime? RemindAt => RemindAfterDays.HasValue ? SentAt.AddDays(RemindAfterDays.Value) : null;

    public bool IsReminderDue(DateTime now) => RemindAt.HasValue && now >= RemindAt.Value;
}

/// <summary>19b · Davet edilen firma. Hatırlatma bir kez gider; gönderildiği an burada durur.</summary>
public class GrantIdeaInvitationRecipient : Entity<Guid>
{
    public Guid InvitationId { get; private set; }

    /// <summary>Davet edilen firma (kiracı). Kayıt host'ta yaşadığı için <c>IMultiTenant</c> değildir.</summary>
    public Guid FirmTenantId { get; private set; }

    public DateTime? RemindedAt { get; private set; }

    protected GrantIdeaInvitationRecipient() { }

    internal GrantIdeaInvitationRecipient(Guid id, Guid invitationId, Guid firmTenantId) : base(id)
    {
        InvitationId = invitationId;
        FirmTenantId = firmTenantId;
    }

    public void MarkReminded(DateTime now)
    {
        RemindedAt ??= now;
    }
}
