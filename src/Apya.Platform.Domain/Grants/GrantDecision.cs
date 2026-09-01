using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6b · Kurumun başvuruya verdiği karar ve itiraz süreci.
///
/// <para>Başvuru başına TEK karar tutulur; kurum kararını değiştirirse aynı kayıt
/// güncellenir. İtiraz sonucu ayrı bir karar değil, bu kaydın alanıdır — "hangi
/// karara itiraz edildi" sorusu ancak böyle tek cevaplı kalır.</para>
///
/// <para>🔴 Red kararı ve gerekçeleri SİLİNMEZ: firma geçmişinde kalır ve sonraki
/// başvuruda uyarı üretmek için okunur (tasarım 6b'nin notu).</para>
/// </summary>
public class GrantDecision : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }
    public GrantDecisionOutcome Outcome { get; private set; }
    public DateTime DecidedOn { get; private set; }

    /// <summary>Kurumun karar numarası (TYD-2026-1184 gibi); mono gösterilir.</summary>
    public string? ReferenceNo { get; private set; }

    /// <summary>İtiraz penceresinin son günü; geçtiyse itiraz gönderilemez.</summary>
    public DateTime? AppealDeadline { get; private set; }

    /// <summary>İtiraz dosyasının kuruma gönderildiği an.</summary>
    public DateTime? AppealSubmittedAt { get; private set; }

    /// <summary>İtiraz sonuçlandıysa kabul edildi mi; sonuçlanmadıysa null.</summary>
    public bool? AppealAccepted { get; private set; }

    public ICollection<GrantAppealItem> Items { get; set; } = new List<GrantAppealItem>();

    protected GrantDecision() { }

    public GrantDecision(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        GrantDecisionOutcome outcome,
        DateTime decidedOn,
        string? referenceNo,
        DateTime? appealDeadline) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        Outcome = outcome;
        DecidedOn = decidedOn;
        ReferenceNo = referenceNo;
        AppealDeadline = appealDeadline;
    }

    public void Update(GrantDecisionOutcome outcome, DateTime decidedOn, string? referenceNo, DateTime? appealDeadline)
    {
        Outcome = outcome;
        DecidedOn = decidedOn;
        ReferenceNo = referenceNo;
        AppealDeadline = appealDeadline;
    }

    /// <summary>İtiraz penceresi <paramref name="today"/> itibarıyla açık mı.</summary>
    public bool IsAppealWindowOpen(DateTime today) =>
        Outcome == GrantDecisionOutcome.Reddedildi
        && AppealSubmittedAt == null
        && (AppealDeadline == null || AppealDeadline.Value.Date >= today.Date);

    public void SubmitAppeal(DateTime now)
    {
        if (Outcome != GrantDecisionOutcome.Reddedildi)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantAppealOnlyForRejection);
        }
        if (AppealSubmittedAt.HasValue)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantAppealAlreadySubmitted);
        }
        if (AppealDeadline.HasValue && AppealDeadline.Value.Date < now.Date)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantAppealWindowClosed);
        }
        AppealSubmittedAt = now;
    }

    /// <summary>İtiraz sonucu (kurum yanıtı). İstatistikler bu alandan hesaplanır.</summary>
    public void ResolveAppeal(bool accepted)
    {
        if (AppealSubmittedAt == null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantAppealNotSubmitted);
        }
        AppealAccepted = accepted;
    }
}
