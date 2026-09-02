using System;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Zamanlanmış hatırlatmanın "bu eşik için gönderildi" kaydı.
///
/// <para>Worker günde bir kez koşar ve "son tarihe 7 gün kaldı" koşulu o gün boyunca
/// doğru kalır; kayıt tutulmasaydı aynı hatırlatma her turda yeniden gönderilirdi.
/// Anahtar <c>(Trigger, EntityId, DayMark)</c> üçlüsüdür — 7'nci gün gönderilen
/// hatırlatma 3'üncü günü engellemez.</para>
///
/// <para>Soft delete YOK: tekil indeks silinmiş satırlarla dolarsa aynı eşik bir
/// daha hiç gönderilemez (aynı tuzak <see cref="GrantApplicationFieldLock"/>'ta da
/// vardı).</para>
/// </summary>
public class GrantNotificationLog : BasicAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public GrantNotificationTrigger Trigger { get; private set; }

    /// <summary>Hatırlatmanın konusu olan kayıt: başvuru ya da rapor.</summary>
    public Guid EntityId { get; private set; }

    /// <summary>Hangi eşikte gönderildi (7, 3, 1 … kalan gün).</summary>
    public int DayMark { get; private set; }

    public DateTime SentAt { get; private set; }

    protected GrantNotificationLog() { }

    public GrantNotificationLog(
        Guid id,
        Guid? tenantId,
        GrantNotificationTrigger trigger,
        Guid entityId,
        int dayMark,
        DateTime sentAt)
        : base(id)
    {
        TenantId = tenantId;
        Trigger = trigger;
        EntityId = entityId;
        DayMark = dayMark;
        SentAt = sentAt;
    }
}
