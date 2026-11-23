using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Firmanın öneri akışındaki tepkisinin DEĞİŞMEZ kaydı ("İlgilenmiyorum", "Geri al").
///
/// <para>Durum değil OLAY tutulur: satır güncellenmez, silinmez. Çağrının bugünkü hâli
/// (kapalı mı) kiracının o çağrıdaki SON olayından okunur. Böylece "kapattı, geri aldı,
/// başvurdu" gibi sıralar ileride skor ayarı için kaybolmaz.</para>
///
/// <para>O anki skor ve uygunluk kovası birlikte saklanır: profil ve ağırlıklar zamanla
/// değişir, "skor 82 iken alan dışı dendi" sonradan yeniden hesaplanamaz. Kimin yaptığı
/// <c>CreatorId</c>'de, ne zaman olduğu <c>CreationTime</c>'da.</para>
/// </summary>
public class GrantRecommendationEvent : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantCallId { get; private set; }

    /// <summary>Çağrının programı — gelecek yılın çağrısıyla ilişki kurmak için.</summary>
    public Guid GrantId { get; private set; }

    public GrantRecommendationEventKind Kind { get; private set; }

    /// <summary>Yalnız <see cref="GrantRecommendationEventKind.Dismissed"/> olayında dolu.</summary>
    public GrantDismissReason? Reason { get; private set; }

    public string? Note { get; private set; }

    /// <summary>Olay anındaki uyum skoru (0-100).</summary>
    public int MatchScore { get; private set; }

    /// <summary>Olay anındaki uygunluk kovası.</summary>
    public GrantEligibilityBucket Bucket { get; private set; }

    /// <summary>Olay anında çağrının danışmanca önerilmiş (kapatılmamış) olup olmadığı.</summary>
    public bool WasHostRecommended { get; private set; }

    protected GrantRecommendationEvent() { }

    private GrantRecommendationEvent(
        Guid id,
        Guid? tenantId,
        Guid grantCallId,
        Guid grantId,
        GrantRecommendationEventKind kind,
        GrantDismissReason? reason,
        string? note,
        int matchScore,
        GrantEligibilityBucket bucket,
        bool wasHostRecommended) : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        GrantId = grantId;
        Kind = kind;
        Reason = reason;
        Note = string.IsNullOrWhiteSpace(note)
            ? null
            : Check.Length(note.Trim(), nameof(note), GrantRecommendationEventConsts.MaxNoteLength);
        MatchScore = Math.Clamp(matchScore, 0, 100);
        Bucket = bucket;
        WasHostRecommended = wasHostRecommended;
    }

    public static GrantRecommendationEvent Dismissed(
        Guid id,
        Guid? tenantId,
        Guid grantCallId,
        Guid grantId,
        GrantDismissReason reason,
        string? note,
        int matchScore,
        GrantEligibilityBucket bucket,
        bool wasHostRecommended)
    {
        if (!Enum.IsDefined(reason))
        {
            throw new ArgumentException($"Tanımsız gerekçe: {reason}", nameof(reason));
        }

        return new GrantRecommendationEvent(id, tenantId, grantCallId, grantId,
            GrantRecommendationEventKind.Dismissed, reason, note, matchScore, bucket, wasHostRecommended);
    }

    public static GrantRecommendationEvent Restored(
        Guid id,
        Guid? tenantId,
        Guid grantCallId,
        Guid grantId,
        int matchScore,
        GrantEligibilityBucket bucket,
        bool wasHostRecommended)
        => new(id, tenantId, grantCallId, grantId,
            GrantRecommendationEventKind.Restored, null, null, matchScore, bucket, wasHostRecommended);
}
