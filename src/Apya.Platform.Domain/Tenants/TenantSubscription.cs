using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tenants;

/// <summary>
/// Bir kiracının bir paketi ne zamana kadar kullanabileceğini anlatan DÖNEM kaydı.
/// Host-side'dır (<c>IMultiTenant</c> DEĞİL) — <see cref="TenantProfile"/> ile aynı ray.
///
/// <para><b>Etkin paket burada DEĞİL, <see cref="TenantProfile.PackageCode"/>'dadır.</b>
/// İzin tavanı (<see cref="PackageCeilingStore"/>) ve feature seti profili okur; bu kayıt
/// yalnız "geçerlilik ne zaman bitiyor" sorusunu yanıtlar. Süre dolduğunda profil Basic'e
/// çekilir ve bu satır <see cref="SubscriptionStatus.Expired"/> olur.</para>
///
/// <para>Kiracının aynı anda en fazla bir yürürlükteki satırı olur; paket değişince eskisi
/// <see cref="SubscriptionStatus.Superseded"/> ile kapanır, geçmiş silinmez. Abonelik satırı
/// HİÇ OLMAYAN kiracı süresiz sayılır ve süre işleyicisi ona dokunmaz — özellik devreye
/// girmeden önce kurulmuş kiracılar bu yüzden kendiliğinden düşmez.</para>
/// </summary>
public class TenantSubscription : FullAuditedAggregateRoot<Guid>
{
    public Guid TenantId { get; private set; }

    /// <summary>Bu dönem boyunca geçerli olan paket.</summary>
    public PackageCode PackageCode { get; private set; }

    public SubscriptionPeriod Period { get; private set; }

    public DateTime StartDate { get; private set; }

    /// <summary><c>null</c> = süresiz (<see cref="SubscriptionPeriod.Unlimited"/>): hiç dolmaz.</summary>
    public DateTime? EndDate { get; private set; }

    public SubscriptionStatus Status { get; private set; }

    /// <summary>
    /// Ek sürenin (grace) bittiği an. Yalnız <see cref="SubscriptionStatus.InGrace"/> iken doludur;
    /// ek süre ayarı 0 olduğunda hep <c>null</c> kalır.
    /// </summary>
    public DateTime? GraceEndsAt { get; private set; }

    /// <summary>Satırın kapandığı an (Expired / Superseded).</summary>
    public DateTime? EndedAt { get; private set; }

    public SubscriptionSource Source { get; private set; }

    /// <summary>
    /// ÖDEME KANCASI — bugün hiçbir yerde <c>true</c> yazılmaz. Ödeme altyapısı geldiğinde
    /// süre işleyicisi, bu bayrağı taşıyan aboneliği düşürmek yerine tahsilat akışına verir.
    /// </summary>
    public bool AutoRenew { get; private set; }

    /// <summary>
    /// ÖDEME KANCASI — sağlayıcıdaki abonelik/sözleşme numarası. Bugün hep <c>null</c>.
    /// </summary>
    public string? ExternalReference { get; private set; }

    /// <summary>
    /// Bu dönem için gönderilmiş son "süresi doluyor" uyarısının eşiği (kaç gün kala).
    /// Aynı eşiğin her turda yeniden bildirim üretmesini engeller; daha küçük bir eşiğe
    /// gelindiğinde (7 → 1) yeniden uyarılır.
    /// </summary>
    public int? LastWarningDaysBefore { get; private set; }

    protected TenantSubscription() { }

    /// <summary>
    /// ARCH-049: Entity <c>IClock</c> inject edemez — başlangıç tarihini çağıran verir
    /// (<see cref="TenantSubscriptionManager"/>).
    /// </summary>
    public TenantSubscription(
        Guid id,
        Guid tenantId,
        PackageCode packageCode,
        SubscriptionPeriod period,
        DateTime startDate,
        SubscriptionSource source)
        : base(id)
    {
        TenantId = tenantId;
        PackageCode = packageCode;
        Period = period;
        StartDate = startDate;
        EndDate = CalculateEndDate(startDate, period);
        Status = SubscriptionStatus.Active;
        Source = source;
    }

    /// <summary>Dönemin bitiş tarihi. Süresizde <c>null</c>; diğerlerinde enum değeri kadar AY eklenir.</summary>
    public static DateTime? CalculateEndDate(DateTime startDate, SubscriptionPeriod period)
        => period == SubscriptionPeriod.Unlimited ? null : startDate.AddMonths((int)period);

    /// <summary>Paketin fiilen kapanacağı an: ek süre verildiyse o, yoksa bitiş tarihi.</summary>
    public DateTime? EffectiveEndDate => GraceEndsAt ?? EndDate;

    /// <summary>Satır hâlâ yürürlükte mi (paket açık mı)?</summary>
    public bool IsCurrent => Status is SubscriptionStatus.Active or SubscriptionStatus.InGrace;

    /// <summary>Bitiş tarihi geçti; ek süre başlıyor. Paket bu aşamada HÂLÂ açıktır.</summary>
    public void MarkInGrace(DateTime graceEndsAt)
    {
        Status = SubscriptionStatus.InGrace;
        GraceEndsAt = graceEndsAt;
    }

    /// <summary>Süre (varsa ek süre dahil) doldu. Çağıranın ayrıca kiracıyı Basic'e çekmesi gerekir.</summary>
    public void Expire(DateTime now)
    {
        Status = SubscriptionStatus.Expired;
        EndedAt = now;
    }

    /// <summary>Yerine yeni bir dönem açıldığı için kapanır.</summary>
    public void Supersede(DateTime now)
    {
        Status = SubscriptionStatus.Superseded;
        EndedAt = now;
    }

    /// <summary>"Süresi doluyor" uyarısının gönderildiği eşiği işaretler.</summary>
    public void MarkWarned(int daysBefore) => LastWarningDaysBefore = daysBefore;

    /// <summary>
    /// ÖDEME KANCASI — sağlayıcı referansını ve otomatik yenileme tercihini yazar.
    /// Ödeme modülü gelene kadar çağrılmaz.
    /// </summary>
    public void SetPaymentReference(string? externalReference, bool autoRenew)
    {
        ExternalReference = externalReference;
        AutoRenew = autoRenew;
    }
}
